'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const restaurants = await queryInterface.sequelize.query('SELECT id FROM Restaurants', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const likes = []
    const selectedPairs = new Set()

    while (likes.length < 25) {
      let userId, restaurantId, pair

      do {
        userId = users[Math.floor(Math.random() * users.length)].id
        restaurantId = restaurants[Math.floor(Math.random() * restaurants.length)].id
        pair = `${userId}_${restaurantId}`
      } while (selectedPairs.has(pair))

      selectedPairs.add(pair)

      likes.push({
        user_id: userId,
        restaurant_id: restaurantId,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('Likes', likes)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Likes', null)
  }
}
