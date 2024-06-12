const { localFileHandler } = require('../helpers/file-helpers')
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
          const err = new Error('找不到這位使用者!')
          err.status = 404
          throw err
        }
        return res.json({
          status: 'success',
          user
        })
      })
      .catch(err => next(err))
  },
  postUserProfileImage: (req, res, next) => {
    const { file } = req
    return localFileHandler(file)
      .then(filePath => {
        return res.json({ status: 'success', filePath })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { userId } = req.params
    if (Number(userId) !== req.user.id) {
      const err = new Error('你沒有權限修改此資料!')
      err.status = 403
      throw err
    }

    const { name, introducion, avatar } = req.body
    if (!name) {
      const err = new Error('請輸入你的名字!')
      err.status = 400
      throw err
    }

    return User.findByPk(userId)
      .then(user => {
        if (!user) {
          const err = new Error('沒有找到這位使用者!')
          err.status = 404
          throw err
        }
        return user.update({ name, introducion, avatar })
      })
      .then(updatedUser => {
        return res.json({
          status: 'success',
          updatedUser
        })
      })
      .catch(err => next(err))
  }
}

module.exports = userControllers
