'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })

      User.hasMany(models.Restaurant, {
        foreignKey: 'userId',
        as: 'CreatedRestaurants'
      })

      User.hasMany(models.Restaurant, {
        through: models.Save,
        foreignKey: 'userId',
        as: 'SavedRestaurants'
      })

      User.hasMany(models.Comment, {
        foreignKey: 'userId'
      })

      User.hasMany(models.Restaurant, {
        through: models.Comment,
        foreignKey: 'userId',
        as: 'CommentedRestaurants'
      })
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    introduction: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
