'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE is_admin = false', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const restaurants = await queryInterface.sequelize.query('SELECT id FROM Restaurants', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkInsert('Comments', Array.from({ length: 15 }, () => ({
      restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      text: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null)
  }
}
