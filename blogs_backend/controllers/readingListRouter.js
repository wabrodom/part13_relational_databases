const router = require('express').Router()
const { Blog, UserBlogs } = require('../models/')
const { tokenExtractor } = require('../util/middleware')


router.post('/', tokenExtractor, async( req, res, next) => {
  const { blogId, userId } = req.body 
  if (typeof blogId === 'undefined' ||
      typeof userId === 'undefined') {
    throw new ReferenceError ("some required field of args not provided")
  }

  if (typeof blogId !== 'number' ||
      typeof userId !== 'number' ) {
    throw new TypeError("invalid type of args")
  }

  if (req.decodedToken.id !== userId) {
    throw new Error("One can't add a blog to others' accounts")
  }

  try {
    const foundblog = await Blog.findByPk(blogId)
    const userBlogsRow = await UserBlogs.create({ 
      userId, 
      blogId: foundblog.id 
    })
    
    res.status(201).json(userBlogsRow)
  } catch(error) {
    next(error)
  }
})

module.exports = router