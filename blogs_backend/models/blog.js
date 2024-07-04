const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')


const sequelize = new Sequelize(process.env.DATABASE_URL, {})

class Blog extends Model {}
Blog.init(
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
    modelName: 'blog' 
})

Blog.sync()

module.exports = Blog