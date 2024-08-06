const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models/')
const { blogFinder, tokenExtractor } = require('../util/middleware')
const { sequelize } = require('../util/db')

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
      order: [
        ['likes', 'DESC'],
      ],
    })
    res.json(blogs)

  } catch (error) {
    next(error)
  }
})

router.get('/:id', async(req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'users_marked',
        attributes:['name'],
        through: {
          attributes: ["readingState"]
        }
      }
    })
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
  const { author, url, title, year } = req.body
  
  try {
    if (typeof author === 'undefined' ||
        typeof url === 'undefined' ||
        typeof title === 'undefined'
    ) {
      throw new ReferenceError ("some required field of args not provided")
    }
    if (typeof author !== 'string' ||
        typeof url !== 'string' ||
        typeof title !== 'string'
    ) {
      throw new TypeError("invalid type of args")
    }

    const user = await User.findByPk(req.decodedToken.id)
    const blog  = await Blog.create({ 
      author, url, title, 
      userId: user.id,  //sequelize args.userId  
      year: year
    })  
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