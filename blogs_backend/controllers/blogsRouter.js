const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models/')
const { blogFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async(req, res, next) => {
  // ?search=*   will search both title and author
  let where = {}

  if (req.query.search) {
    const pattern = `%${req.query.search}%`
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: pattern
          }
        },
        {
          author: {
            [Op.iLike]: pattern
          }
        },
      ]
    }
  }

  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
    })
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

router.post('/', tokenExtractor, async(req, res, next) => {
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

    const user = await User.findByPk(req.decodedToken.id)
    const blog  = await Blog.create({ author, url, title, userId: user.id })  //sequelize agc.userId  
    res.status(201).json(blog)
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

router.delete('/:id', [blogFinder, tokenExtractor] , async(req, res, next) => {
  try {
    const blogToDelete = req.blog
    const currentLoginUserId = req.decodedToken.id

    if (blogToDelete === null) {
      return res.status(404).send({ error: 'Id to delete is not found!' })
    }

    if (blogToDelete.userId !== currentLoginUserId) {
      return response.status(401).json({
        error: 'user who in not added the blog, cannot delete!'
      })
    }

    await blogToDelete.destroy()
    res.status(204).end()
    return
  } catch(error) {
    next(error)
  }
})

module.exports = router



/*
  // //raw query
  // const blogs =  await sequelize.query('select * from blogs', { type: QueryTypes.SELECT })
*/