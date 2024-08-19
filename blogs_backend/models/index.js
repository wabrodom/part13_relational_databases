const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'readingBlogs' }) 
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_marked' }) 

User.hasOne(Session)
Session.belongsTo(User)

module.exports = {
  Blog, 
  User, 
  UserBlogs,
  Session,
}
