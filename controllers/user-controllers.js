const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Restaurant, Category, sequelize } = require('../models')

const userControllers = {
  getUserProfile: (req, res, next) => {
    const { userId } = req.params

    return User.findByPk(userId, {
      include: [
        { model: Restaurant, as: 'CreatedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: Restaurant, as: 'LikedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: Restaurant, as: 'SavedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: Restaurant, as: 'CommentedRestaurants', include: { model: Category, attributes: ['name'] } },
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] }
      ]
    })
      .then(user => {
        if (!user) {
          const err = new Error('找不到這位使用者!')
          err.status = 404
          throw err
        }

        const userData = {
          ...user.toJSON(),
          Followers: user.Followers.map(u => u.id),
          Followings: user.Followings.map(u => u.id)
        }
        return res.json({
          user: userData
        })
      })
      .catch(err => next(err))
  },
  postUserProfileImage: async (req, res, next) => {
    const { file } = req
    console.log(file)
    return imgurFileHandler(file)
      .then(filePath => {
        return res.json({ filePath })
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

    const { name, introduction, avatar } = req.body
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
        return user.update({ name, introduction, avatar })
      })
      .then(updatedUser => {
        return res.json({
          updatedUser
        })
      })
      .catch(err => next(err))
  },
  getTop10Users: (req, res, next) => {
    return User.findAll({
      attributes: [
        'id',
        'name',
        'avatar',
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM Followships
            WHERE following_id = User.id
          )`),
          'UserFollowersCount'
        ]
      ],
      include: [
        { model: Restaurant, as: 'CreatedRestaurants', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] }
      ],
      having: sequelize.literal('UserFollowersCount > 0'),
      order: [[sequelize.literal('UserFollowersCount'), 'DESC']],
      limit: 10
    })
      .then(top10Users => {
        const usersData = top10Users.map(user => ({
          ...user.toJSON(),
          CreatedRestaurants: user.CreatedRestaurants.map(r => r.id),
          Followers: user.Followers.map(u => u.id)
        }))
        return res.json({ top10Users: usersData })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const { userId } = req.params
    return User.findByPk(userId, {
      attributes: ['id', 'name', 'avatar'],
      include: [
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] }
      ]

    })
      .then(user => {
        if (!user) {
          const err = new Error('找不到這位使用者!')
          err.status = 404
          throw err
        }
        const userData = {
          ...user.toJSON(),
          Followers: user.Followers.map(u => u.id),
          Followings: user.Followings.map(u => u.id)
        }
        return res.json({
          user: userData
        })
      })
      .catch(err => next(err))
  }

}

module.exports = userControllers
