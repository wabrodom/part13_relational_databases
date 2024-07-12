const router = require('express').Router()

const { Blog } = require('../models/')
const { blogFinder } = require('../util/middleware')

router.get('/', async(req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)

  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async(req, res, next) => {
  try {
    const blog = req.blog
    if (blog) {
      res.json(blog)
    } else {
      res
        .status(404)
        .send({ error: 'blog not found!' })
    }

  } catch (error) {
    next(error)
  }
})

router.post('/', async(req, res, next) => {
  const { author, url, title } = req.body
  
  try {
    if (typeof author === 'undefined' ||
        typeof url === 'undefined' ||
        typeof title === 'undefined'
    ) {
      throw new ReferenceError ("some field of args not provided")
    }
    if (typeof author !== 'string' ||
        typeof url !== 'string' ||
        typeof title !== 'string'
    ) {
      throw new TypeError("invalid type of args")
    }

    const blog  = await Blog.create({ author, url, title })
    res.json(blog)
    res.end()

  } catch (error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async(req, res, next) => {
  const { likes } = req.body

  try {
    if (typeof likes !== 'number' ) {
      throw new TypeError("likes is needed to be a number")
    }

    const blogToUpdate = req.blog

    if (Math.abs(likes - blogToUpdate.likes) > 1) {
      throw new RangeError('likes need to increased or decreased by 1')
    }
    
    blogToUpdate.likes = likes
    blogToUpdate.save()
    res.json(blogToUpdate)

  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, async(req, res, next) => {
  try {
    const blogToDelete = req.blog
    if (blogToDelete) {
      await blogToDelete.destroy()
      res.status(204).end()
      return 
    }
  } catch(error) {
    next(error)
  }
  res.status(404).send({ error: 'Id to delete is not found!' })
})

module.exports = router



/*
  // //raw query
  // const blogs =  await sequelize.query('select * from blogs', { type: QueryTypes.SELECT })
*/