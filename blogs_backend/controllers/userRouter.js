const router = require('express').Router()
const crypto = require('crypto');
const { bcrypt } = require('hash-wasm') 
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { User } = require('../models')

const tokenExtractor = (req, res, next) => {  
  const authorization = req.get('authorization')  
  console.log(authorization, '----------------------------')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {    
    try {      
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)    
    } catch{      
      return res.status(401).json({ error: 'token invalid' })    
    } 

  }  else {    
    return res.status(401).json({ error: 'token missing' })  
  }  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'id'] },
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body
  try { 
    const salt = crypto.randomBytes(16);

    const passwordHash = await bcrypt({
      password,
      salt,
      costFactor: 11,
      outputType: 'encoded',
    })
    
    const user = User.build({
      username,
      name,
      passwordHash
    })
    await user.save()

    const userWithoutPasswordHash = user.toJSON()
    delete userWithoutPasswordHash.passwordHash

    res.status(201).json(userWithoutPasswordHash)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', tokenExtractor, async(req, res, next) => {
  const oldUsername = req.params.username
  const { newUsername } = req.body

  try {
    const loggedInUserId = req.decodedToken.id
    const foundUser = await User.findOne({
      where: {
        username: oldUsername
      }
    })

    if (loggedInUserId !== foundUser.id) {
      return response.status(401).json({
        error: 'logged-in user is not the owner of this username'
      })
    }

    foundUser.username = newUsername
    await foundUser.save()

    const userWithoutPasswordHash = foundUser.toJSON()
    delete userWithoutPasswordHash.passwordHash

    res.status(200).send(userWithoutPasswordHash)
  } catch(error) {
    next(error)
  }
})


module.exports = router