'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Comments', 'comments_ibfk_1')
    await queryInterface.addConstraint('Comments', {
      fields: ['restaurant_id'],
      type: 'foreign key',
      name: 'comments_ibfk_1',
      references: {
        table: 'Restaurants',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Comments', 'comments_ibfk_1')
    await queryInterface.addConstraint('Comments', {
      fields: ['restaurant_id'],
      type: 'foreign key',
      name: 'comments_ibfk_1',
      references: {
        table: 'Restaurants',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }
}
