const { User } = require('../models')

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

        return User.create({ name, email, password })
      })
      .then(() => {
        return res.status(200).json({ status: 'success', message: '註冊成功!' })
      })
      .catch(err => next(err))
  }
}

module.exports = authControllers
