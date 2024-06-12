const { User, Restaurant, Category } = require('../models')

const userControllers = {
  getUserProfile: (req, res, next) => {
    const { userId } = req.params

    return User.findByPk(userId, {
      include: [
        { model: Restaurant, as: 'CreatedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: Restaurant, as: 'LikedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: Restaurant, as: 'SavedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: Restaurant, as: 'CommentedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User not found'
          })
        }
        return res.json({
          status: 'success',
          user
        })
      })
      .catch(err => next(err))
  }
}

module.exports = userControllers
