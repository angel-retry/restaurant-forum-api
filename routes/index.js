const express = require('express')
const { apiErrorHandler } = require('../middlewares/error-handler')
const authControllers = require('../controllers/auth-controllers')
const router = express.Router()

router.post('/signup', authControllers.postSignup)
router.get('/restaurants', function (req, res) {
  const data = 5
  return res.json({ data })
})

router.use('', apiErrorHandler)

module.exports = router
