'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE is_admin = false', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const followships = []

    for (let i = 0; i < 15; i++) {
      let followingId, followerId

      followerId = users[Math.floor(Math.random() * users.length)].id

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
