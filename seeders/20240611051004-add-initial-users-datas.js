'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash('12345678', 10)
    await queryInterface.bulkInsert('Users', Array.from({ length: 15 }, (_, index) => (
      {
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: hashPassword,
        avatar: faker.image.avatar(),
        created_at: new Date(),
        updated_at: new Date()
      }
    )))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}
