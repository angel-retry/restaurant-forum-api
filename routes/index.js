const express = require('express')
const { apiErrorHandler } = require('../middlewares/error-handler')
const authControllers = require('../controllers/auth-controllers')
const router = express.Router()
const passport = require('../config/passport')

router.post('/signup', authControllers.postSignup)
router.post('/signin', (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ status: 400, message: '請輸入帳號及密碼!' })
  }
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ status: 401, message: '密碼輸入錯誤!' })
    req.user = user
    next()
  })(req, res, next)
}, authControllers.postSignin)

router.get('/restaurants', function (req, res) {
  const data = 5
  return res.json({ data })
})

router.use('', apiErrorHandler)

module.exports = router
