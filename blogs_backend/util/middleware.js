const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Blog } = require( '../models/')


const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

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
  next(error)
}

module.exports = {
  blogFinder,
  tokenExtractor,
  errorHandler
}