'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const categories = await queryInterface.sequelize.query('SELECT id FROM Categories', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    await queryInterface.bulkInsert('Restaurants', Array.from({ length: 15 }, (_, index) => {
      const street = faker.location.streetAddress()
      const city = faker.location.city()
      const state = faker.location.state()
      const zipCode = faker.location.zipCode()
      const country = faker.location.country()
      const location = `${street}, ${city}, ${state}, ${zipCode}, ${country}`

      return {
        name: faker.company.name(),
        tel: faker.phone.number(),
        address: location,
        address_url: `https://www.google.com.tw/maps/place/${state}`,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        created_by: users[Math.floor(Math.random() * users.length)].id,
        introduction: faker.lorem.paragraph(),
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
