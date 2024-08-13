const router = require('express').Router()
const { Blog, UserBlogs, User } = require('../models/')
const { tokenExtractor } = require('../util/middleware')
const { userNotCreateThisList } = require('../util/errorMessages')

router.get('/', async(req, res, next) => {
  try {
    const userBlogsReadingList = await UserBlogs.findAll()
    res.json(userBlogsReadingList)
  } catch(error) {
    next(error)
  }
})

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

router.put('/:id', tokenExtractor, async( req, res, next) => {
  const { read } = req.body
  const id = req.params.id
  const currentUserId = req.decodedToken.id

  if (typeof read === undefined) {
    throw new ReferenceError ("read arg. is not provided")
  }
  if (typeof read !== 'boolean') {
    throw new TypeError("read arg. is required boolean type")
  }

  try {
    const foundUserBlogsRow = await UserBlogs.findByPk(id)
    if (foundUserBlogsRow.userId !== currentUserId) {
      throw new Error(userNotCreateThisList)
    }

    foundUserBlogsRow.readingState = read
    await foundUserBlogsRow.save()
    res.status(200).json(foundUserBlogsRow)
  } catch(error) {
    next(error)
  }

})

module.exports = router