'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE is_admin = false', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const restaurants = await queryInterface.sequelize.query('SELECT id FROM Restaurants', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const saves = []
    const selectedPairs = new Set()

    while (saves.length < 15) {
      let userId, restaurantId, pair

      do {
        userId = users[Math.floor(Math.random() * users.length)].id
        restaurantId = restaurants[Math.floor(Math.random() * restaurants.length)].id
        pair = `${userId}-${restaurantId}`
      } while (selectedPairs.has(pair))

      selectedPairs.add(pair)

      saves.push({
        user_id: userId,
        restaurant_id: restaurantId,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('Saves', saves)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Saves', null)
  }
}
