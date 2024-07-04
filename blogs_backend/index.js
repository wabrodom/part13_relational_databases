require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()
const sequelize = new Sequelize(process.env.DATABASE_URL, {})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs =  await sequelize.query(
      'select * from blogs', 
      { type: QueryTypes.SELECT }
    )
    
    blogs.forEach(b => {
      const {author, title, likes } = b
      console.log(`${author}: ${title}, ${likes} likes`)
    })

    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()

/* 


class Blogs extends Model {}
Blogs.init(
  {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
  },{  
    sequelize,  
    underscored: true,  
    timestamps: false,  
    modelName: 'blogs' 
})


app.use('/api/blogs', async(req, res) => {
  // const blogs =  await sequelize.query('select * from blogs', { type: QueryTypes.SELECT })
  const blogs = await Blogs.findAll()
  
  for (let b of blogs) {
    const {author, title, likes } = b
    console.log(`${author}: ${title}, ${likes} likes`)
  }

  res.json(blogs)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
})


*/