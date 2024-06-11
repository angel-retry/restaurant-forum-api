'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Comment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    restaurantId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Restaurants',
        key: 'id'
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  })
  return Comment
}
