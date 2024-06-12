const { Restaurant, Save } = require('../models')

const saveControllers = {
  postSavedRestaurant: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    Promise.all([
      Restaurant.findByPk(restaurantId, { attributes: ['id'] }),
      Save.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, save]) => {
        if (!restaurant) {
          const err = new Error('沒有這間餐廳!')
          err.status = 404
          throw err
        }

        if (save) {
          const err = new Error('你已經收藏過這間餐廳了!')
          err.status = 400
          throw err
        }

        return Save.create({
          userId,
          restaurantId
        })
      })
      .then(newSaved => {
        return res.json({
          status: 'success',
          newSaved
        })
      })
      .catch(err => next(err))
  }
}

module.exports = saveControllers
