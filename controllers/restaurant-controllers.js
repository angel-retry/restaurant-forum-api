const { Op } = require('sequelize')
const { getOffset } = require('../helpers/pagination-helpers')
const { Restaurant, Category, User, sequelize, Comment } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const restaurantControllers = {
  getRestaurants: (req, res, next) => {
    const keyword = req.query.keyword?.trim()
    const categoryId = Number(req.query.categoryId)
    const limit = Number(req.query.limit) || 9
    const page = Number(req.query.page) || 1
    const offset = getOffset(page, limit)

    const searchCondition = keyword
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { address: { [Op.like]: `%${keyword}%` } },
            { introduction: { [Op.like]: `%${keyword}%` } }
          ]
        }
      : {}

    const whereCondition = {
      ...searchCondition,
      ...(categoryId ? { categoryId } : {})
    }

    Restaurant.findAndCountAll({
      include: [
        Category,
        { model: User, as: 'LikedUsers' },
        { model: User, as: 'SavedUsers' },
        { model: Comment, attributes: ['id'] }
      ],
      where: whereCondition,
      limit,
      offset,
      distinct: true
    })
      .then(restaurants => {
        const restaurantsData = restaurants.rows.map(restaurant => ({
          ...restaurant.toJSON(),
          LikedUsers: restaurant.LikedUsers.map(user => user.id),
          SavedUsers: restaurant.SavedUsers.map(user => user.id),
          Comments: restaurant.Comments.map(comment => comment.id)
        }))
        return res.json({
          restaurants: restaurantsData,
          count: restaurants.count,
          categoryId,
          limit
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params

    Restaurant.findByPk(id, {
      include: [
        Category,
        { model: User, as: 'LikedUsers', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'SavedUsers', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'CreatedBy' },
        { model: Comment, include: User }
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
        updatedRestaurant = updatedRestaurant.toJSON()
        updatedRestaurant.LikedUsers = updatedRestaurant.LikedUsers.map(user => user.id)
        updatedRestaurant.SavedUsers = updatedRestaurant.SavedUsers.map(user => user.id)
        updatedRestaurant.Comments = updatedRestaurant.Comments.map(comment => ({
          id: comment.id,
          text: comment.text,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          userId: comment.User.id,
          username: comment.User.name,
          avatar: comment.User.avatar
        }))

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
        return res.json({ restaurant: newRestaurant })
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
              updatedRestaurant
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
          deleteRestaurant
        })
      })
      .catch(err => next(err))
  },
  getTop10Restaurants: (req, res, next) => {
    return Restaurant.findAll({
      attributes: [
        'id',
        'name',
        'image',
        'introduction',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM Saves
            WHERE restaurant_id = Restaurant.id
          )`),
          'SavedUsersCount'
        ]
      ],
      include: [
        { model: User, as: 'LikedUsers', attributes: ['id'] },
        { model: User, as: 'SavedUsers', attributes: ['id'] },
        { model: Comment, attributes: ['id'] },
        { model: Category, attributes: ['id', 'name'] }
      ],
      having: sequelize.literal('SavedUsersCount > 0'),
      order: [[sequelize.literal('SavedUsersCount'), 'DESC']],
      limit: 10
    })
      .then(top10Restaurants => {
        const restaurantsData = top10Restaurants.map(r => ({
          ...r.toJSON(),
          LikedUsers: r.LikedUsers.map(user => user.id),
          SavedUsers: r.SavedUsers.map(user => user.id),
          Comments: r.Comments.map(comment => comment.id)
        }))
        return res.json({ top10Restaurants: restaurantsData })
      })
      .catch(err => next(err))
  },
  getFeedsRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      attributes: [
        'id',
        'name',
        'image',
        'introduction',
        'createdAt'
      ],
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: User, as: 'CreatedBy', attributes: ['id', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    })
      .then(feedsRestaurants => {
        return res.json({ feedsRestaurants })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantControllers
