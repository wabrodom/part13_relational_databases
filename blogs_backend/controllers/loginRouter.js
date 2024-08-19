const jwt = require('jsonwebtoken')
const { bcryptVerify } = require('hash-wasm') 
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models/')

router.post('/', async (request, response, next) => {
  const { username, password } = request.body
  try {
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    
    if (user === null) {
      return response.status(401).json({
        error: 'username is not found'
      })
    }

    const passwordCorrect = await bcryptVerify({
      password,
      hash: user.passwordHash,
    })
  
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }
  
    const userForToken = {
      username: user.username,
      id: user.id,
    }
  
    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 })
    const { iat } = jwt.verify(token, SECRET)
    const [userSession, createNow ] = await Session.findOrCreate({ 
      where: { userId: user.id },
      defaults: { iat },
    })
    if (!createNow) {
      userSession.iat = iat
      await userSession.save()
    }
    
    response
      .status(200)
      .send({ token })

  } catch(error) {
    next(error)
  }
})

module.exports = router