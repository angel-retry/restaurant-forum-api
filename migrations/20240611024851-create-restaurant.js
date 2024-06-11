'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      addressURL: {
        type: Sequelize.STRING
      },
      openingHours: {
        type: Sequelize.JSON
      },
      introduction: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants')
  }
}
