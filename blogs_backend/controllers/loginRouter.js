const jwt = require('jsonwebtoken')
const { bcryptVerify } = require('hash-wasm') 
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

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
  
    const token = jwt.sign(userForToken, SECRET)
  
    response
      .status(200)
      .send({ token, username: user.username, name: user.name })

  } catch(error) {
    next(error)
  }
})

module.exports = router