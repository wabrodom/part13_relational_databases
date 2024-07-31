const router = require('express').Router()
const { Blog } = require('../models/')
const { sequelize } = require('../util/db')

router.get('/', async(req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      attributes: [
        'author' ,
        [sequelize.fn('COUNT', sequelize.col('title')), 'article'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      group: 'author',
      order:[
        ['likes', 'DESC']
      ]
    })  
    res.json(blogs)

  } catch (error) {
    next(error)
  }
})

module.exports = router