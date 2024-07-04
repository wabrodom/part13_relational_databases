const Blog = require('../models/blog')

const blogsRouter = require('express').Router()

blogsRouter.get('/', async(req, res) => {
  // const blogs =  await sequelize.query('select * from blogs', { type: QueryTypes.SELECT })
  const blogs = await Blog.findAll()
  res.json(blogs)
})

blogsRouter.get('/:id', async(req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res
      .status(404)
      .send({ error: 'blog not found!' })
  }
})

blogsRouter.post('/', async(req, res) => {
  console.log('the req.body', req.body)
  const blog  = await Blog.create(req.body)
  res.json(blog)
  res.end()
})

blogsRouter.delete('/:id', async(req, res) => {
  const blogToDelete = await Blog.findByPk(req.params.id)
  if (blogToDelete) {
    await blogToDelete.destroy()
    return res.status(204).end()
  } 
  return res.status(404).send({ error: 'Id to delete is not found!' })
})

module.exports = blogsRouter


