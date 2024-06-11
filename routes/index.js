const express = require('express')
const { apiErrorHandler } = require('../middlewares/error-handler')
const router = express.Router()

router.get('/restaurants', function (req, res) {
  const data = 5
  return res.json({ data })
})

router.use('', apiErrorHandler)

module.exports = router
