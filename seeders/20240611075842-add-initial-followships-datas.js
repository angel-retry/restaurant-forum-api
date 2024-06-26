'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const followships = []

    while (followships.length < 15) {
      let followingId

      const followerId = users[Math.floor(Math.random() * users.length)].id

      do {
        followingId = users[Math.floor(Math.random() * users.length)].id
      } while (followerId === followingId)

      followships.push({
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('Followships', followships)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Followships', null)
  }
}
