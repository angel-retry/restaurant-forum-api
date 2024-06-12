const express = require('express')
const { apiErrorHandler } = require('../middlewares/error-handler')
const authControllers = require('../controllers/auth-controllers')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middlewares/api-auth')
const restaurantControllers = require('../controllers/restaurant-controllers')
const upload = require('../middlewares/multer')

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

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), authControllers.postSignin)

router.post('/restaurants/image', authenticated, upload.single('image'), restaurantControllers.postRestaurantImage)
router.get('/restaurants/:id', authenticated, restaurantControllers.getRestaurant)
router.get('/restaurants', authenticated, restaurantControllers.getRestaurants)

router.use('', apiErrorHandler)

module.exports = router
