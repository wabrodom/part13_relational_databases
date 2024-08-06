const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readingBlogs' }) 
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_marked' }) 

module.exports = {
  Blog, 
  User, 
  UserBlogs,
}
