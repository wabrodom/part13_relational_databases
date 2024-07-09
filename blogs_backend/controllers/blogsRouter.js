const router = require('express').Router()

const { Blog } = require('../models/')
const { blogFinder } = require('../util/middleware')

router.get('/', async(req, res) => {
  // const blogs =  await sequelize.query('select * from blogs', { type: QueryTypes.SELECT })
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.get('/:id', blogFinder, async(req, res) => {
  const blog = req.blog
  if (blog) {
    res.json(blog)
  } else {
    res
      .status(404)
      .send({ error: 'blog not found!' })
  }
})

router.post('/', async(req, res) => {
  console.log('the req.body', req.body)
  const blog  = await Blog.create(req.body)
  res.json(blog)
  res.end()
})

router.delete('/:id', blogFinder, async(req, res) => {
  const blogToDelete = req.blog
  try {
    if (blogToDelete) {
      await blogToDelete.destroy()
      res.status(204).end()
      return 
    }
  } catch(error) {
    res.status(400).send({ error: 'bad requrest' + error })
  }
  res.status(404).send({ error: 'Id to delete is not found!' })
})

module.exports = router


