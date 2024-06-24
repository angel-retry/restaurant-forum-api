const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authControllers = {
  postSignup: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
      const err = new Error('請填寫所有欄位!')
      err.status = 404
      throw err
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      const err = new Error('密碼必須包含至少一個大寫字母，一個小寫字母，且至少要有 8 個字元!')
      err.status = 400
      throw err
    }

    if (password !== confirmPassword) {
      const err = new Error('密碼與確認密碼不一致!')
      err.status = 404
      throw err
    }

    User.findOne({
      where: { email }
    })
      .then(user => {
        if (user) {
          const err = new Error('此信箱已註冊過!是否要登入?')
          err.status = 400
          throw err
        }

        return bcrypt.hash(password, 10)
          .then(hashPassword => {
            return User.create({ name, email, password: hashPassword })
          })
      })
      .then(() => {
        return res.status(200).json({ status: 'success', message: '註冊成功!' })
      })
      .catch(err => next(err))
  },
  postSignin: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      return res.json({
        token,
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },
  getAuthUser: (req, res, next) => {
    const user = { ...req.user.toJSON() }
    user.LikedRestaurants = user.LikedRestaurants.map(r => r.id)
    user.SavedRestaurants = user.SavedRestaurants.map(r => r.id)
    user.Followers = user.Followers.map(u => u.id)
    user.Followings = user.Followings.map(u => u.id)
    delete user.password

    return res.json({
      authUser: user
    })
  }
}

module.exports = authControllers
