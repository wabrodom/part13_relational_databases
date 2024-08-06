const router = require('express').Router()
const crypto = require('crypto')
const { bcrypt } = require('hash-wasm') 
const { User, Blog, UserBlogs } = require('../models')
const {tokenExtractor} = require('../util/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'id'] },
    include: { 
      model: Blog, 
      attributes: { exclude: ['userId', 'id'] },
    }
  })
  res.json(users)
})

// define the specific route before dynamics routes
router.get('/currentuser', tokenExtractor, async(req, res, next) => {
  try {
    console.log('.------decodedToken---------', req.decodedToken)
    const { id } = req.decodedToken
  
    const loadCurrentUser = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash', 'id'] },
      include: {
        model: Blog
      }
    })
   
    res.json(loadCurrentUser)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId']},
      },
      {
        model: Blog,
        as: 'readingBlogs', 
        attributes: { exclude: ['userId']},
        through: {
          attributes: ["readingState", 'id'],
        }
      }
    ]
  })

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


/*
  attributes: { exclude: ['userId', 'id'] },
  vs
  attributes: ['author', 'url', 'title', 'likes'],

*/