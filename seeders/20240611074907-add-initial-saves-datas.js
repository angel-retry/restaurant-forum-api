'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE is_admin = false', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const Restaurants = await queryInterface.sequelize.query('SELECT id FROM Restaurants', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    await queryInterface.bulkInsert('Saves', Array.from({ length: 15 }, () => ({
      user_id: users[Math.floor(Math.random() * users.length)].id,
      restaurant_id: Restaurants[Math.floor(Math.random() * Restaurants.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Saves', null)
  }
}
