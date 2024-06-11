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
    addressURL: DataTypes.STRING,
    openingHours: DataTypes.JSON,
    introduction: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    image: DataTypes.STRING,
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
