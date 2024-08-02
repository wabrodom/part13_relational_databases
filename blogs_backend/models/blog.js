const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

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
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      possibleYear(value) {
        const currentYear = new Date().getFullYear()
        if (value < 1991 || value > currentYear ) {
          throw new Error(`year should be in range 1991-${currentYear}.`)
        }
      },
    }
  }
  },{  
    sequelize,  
    underscored: true,  
    timestamps: true,  
    modelName: 'blog' 
})

module.exports = Blog