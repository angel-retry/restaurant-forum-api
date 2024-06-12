const { Restaurant, Like } = require('../models')

const likeControllers = {
  postLikedRestaurant: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    Promise.all([
      Restaurant.findByPk(restaurantId, { attributes: ['id'] }),
      Like.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) {
          const err = new Error('沒有這間餐廳!')
          err.status = 404
          throw err
        }

        if (like) {
          const err = new Error('你已經按讚過這間餐廳了!')
          err.status = 400
          throw err
        }

        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(newLiked => {
        return res.json({
          status: 'success',
          newLiked
        })
      })
      .catch(err => next(err))
  },
  deleteLikedRestaurant: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    Promise.all([
      Restaurant.findByPk(restaurantId, { attributes: ['id'] }),
      Like.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) {
          const err = new Error('沒有這間餐廳!')
          err.status = 404
          throw err
        }

        if (!like) {
          const err = new Error('你沒有按讚過這間餐廳!')
          err.status = 400
          throw err
        }

        return like.destroy()
      })
      .then(deleteLiked => {
        return res.json({
          status: 'success',
          deleteLiked
        })
      })
      .catch(err => next(err))
  }
}

module.exports = likeControllers
