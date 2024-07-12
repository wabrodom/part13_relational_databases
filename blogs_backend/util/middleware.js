const { Blog } = require( '../models/')


const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
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
  next(error)
}

module.exports = {
  blogFinder,
  errorHandler
}