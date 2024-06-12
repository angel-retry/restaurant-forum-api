const { Op } = require('sequelize')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { Restaurant, Category, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

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
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params

    Restaurant.findByPk(id, {
      include: [
        Category,
        { model: User, as: 'LikedUsers' },
        { model: User, as: 'SavedUsers' },
        { model: User, as: 'CommentedUsers' },
        { model: User, as: 'CreatedBy' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error('沒有找到這間餐廳!')
          err.status = 404
          throw err
        }
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(updatedRestaurant => {
        return res.json({ restaurant: updatedRestaurant })
      })
      .catch(err => next(err))
  },
  postRestaurantImage: (req, res, next) => {
    const { file } = req
    console.log({ file })

    return localFileHandler(file)
      .then(filePath => {
        return res.json({ filePath })
      })
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    const {
      name,
      address,
      addressUrl,
      openingHours,
      tel,
      introduction,
      categoryId,
      image
    } = req.body
    const createdBy = req.user.id

    if (!name || !categoryId || !introduction) {
      const err = new Error('請填好欄位!')
      err.status = 400
      throw err
    }

    if (!createdBy) {
      const err = new Error('沒有取得使用者資料!')
      err.status = 400
      throw err
    }

    return Restaurant.create({
      name,
      address,
      addressUrl,
      openingHours,
      tel,
      introduction,
      categoryId,
      image,
      createdBy
    })
      .then(newRestaurant => {
        return res.status(201).json({ status: 'success', restaurant: newRestaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { restaurantId } = req.params
    const {
      name,
      address,
      addressUrl,
      openingHours,
      tel,
      introduction,
      categoryId,
      image
    } = req.body
    const authId = req.user.id

    if (!name || !categoryId || !introduction) {
      const err = new Error('請填好欄位!')
      err.status = 400
      throw err
    }

    if (!authId) {
      const err = new Error('沒有取得使用者資料!')
      err.status = 400
      throw err
    }

    return Restaurant.findByPk(restaurantId)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error('沒有找到這間餐廳!')
          err.status = 404
          throw err
        }
        console.log({ restaurant: restaurant.toJSON() })

        if (restaurant.toJSON().createdBy !== authId) {
          const err = new Error('你沒有權限修改這間餐廳!')
          err.status = 403
          throw err
        }

        return restaurant.update({
          name,
          address,
          addressUrl,
          openingHours,
          tel,
          introduction,
          categoryId,
          image
        })
          .then(updatedRestaurant => {
            return res.json({
              status: 'success',
              restaurant: updatedRestaurant
            })
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const { restaurantId } = req.params
    const authId = req.user.id

    return Restaurant.findByPk(restaurantId)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error('沒有找到這間餐廳!')
          err.status = 404
          throw err
        }

        if (restaurant.toJSON().createdBy !== authId) {
          const err = new Error('沒有權限刪除這間餐廳!')
          err.status = 403
          throw err
        }

        return restaurant.destroy()
      })
      .then((deleteRestaurant) => {
        return res.json({
          status: 'success',
          restaurant: deleteRestaurant
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantControllers
