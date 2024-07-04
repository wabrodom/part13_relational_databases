require('dotenv').config()
const blogsRouter = require('./controllers/blogsRouter')
const express = require('express')

const app = express()
app.use(express.json())

app.use('/api/blogs', blogsRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
})


/*
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

*/