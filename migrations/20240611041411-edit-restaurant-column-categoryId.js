'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'category_Id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'category_Id', {
      type: Sequelize.INTEGER,
      references: null,
      onDelete: null
    })
  }
}
