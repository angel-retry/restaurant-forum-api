'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' })

      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'restaurantId',
        as: 'LikedUsers'
      })

      Restaurant.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'CreatedBy'
      })

      Restaurant.belongsToMany(models.User, {
        through: models.Save,
        foreignKey: 'restaurantId',
        as: 'SavedUsers'
      })

      Restaurant.hasMany(models.Comment, {
        foreignKey: 'restaurantId'
      })

      Restaurant.belongsToMany(models.User, {
        through: models.Comment,
        foreignKey: 'restaurantId',
        as: 'CommentedUsers'
      })
    }
  }
  Restaurant.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    addressUrl: DataTypes.STRING,
    openingHours: DataTypes.JSON,
    introduction: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    image: DataTypes.STRING,
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    viewCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
