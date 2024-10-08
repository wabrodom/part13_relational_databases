const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog, Session } = require( '../models/')
const { userNotCreateThisList } = require('./errorMessages')

const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = async (req, res, next) => {  
  const authorization = req.get('authorization')  

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {    
    try {      
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)

      const currentSession = await Session.findOne({ where: { user_id: decodedToken.id }})
      if(decodedToken.iat < currentSession.iat) {
        return res.status(401).json({ error: 'unauthorized token is not latest' })    
      }

      req.decodedToken = decodedToken
    } catch {      
      return res.status(401).json({ error: 'token invalid' })    
    } 

  }  else {    
    return res.status(401).json({ error: 'token missing' })  
  } 
   
  next()
}

// known error
// not catch-all error sent to next middleware or default express error handle
const errorHandler = (error, request, response, next) => {
  console.log('errorHandle message: ', error.message)
  console.log('errorHandle name: ', error.name)

  if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: error.message })
  }

  if (error.name === 'ReferenceError') {
    return response.status(400).send({ error: error.message })
  }

  if (error.name === 'TypeError') {
    return response.status(400).send({ error: error.message })
  }

  if (error.name === 'RangeError') {
    return response.status(400).send({ error: error.message })
  }

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  if(error.name === 'SequelizeValidationError') {
    return response.status(400).send(error.message)
  }
  
  if(error.message === userNotCreateThisList) {
    return response.status(400).send(error.message)
  }

  next(error)
}

module.exports = {
  blogFinder,
  tokenExtractor,
  errorHandler
}