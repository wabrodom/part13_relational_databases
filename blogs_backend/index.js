const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogsRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/loginRouter')
const logoutRouter = require('./controllers/logoutRouter')
const sessionRouter = require('./controllers/sessionRouter')
const authorRouter = require('./controllers/authorRouter')
const readingListRouter = require('./controllers/readingListRouter')
const { errorHandler } = require('./util/middleware')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
  })

}

start()

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