const { Op } = require('sequelize')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { Restaurant, Category } = require('../models')

const restaurantControllers = {
  getRestaurants: (req, res, next) => {
    const { search } = req.query
    const categoryId = Number(req.query.categoryId)
    const limit = 9
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)

    const searchCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } },
            { introduction: { [Op.like]: `%${search}%` } },
            { '$Category.name$': { [Op.like]: `%${search}%` } }
          ]
        }
      : {}

    const whereCondition = {
      ...searchCondition,
      ...(categoryId ? { categoryId } : {})
    }
    Restaurant.findAndCountAll({
      include: [Category],
      where: whereCondition,
      nest: true,
      raw: true,
      limit,
      offset
    })
      .then(restaurants => {
        return res.json({
          restaurants: restaurants.rows,
          page,
          pagination: getPagination(page, limit, restaurants.count),
          categoryId,
          search
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantControllers
