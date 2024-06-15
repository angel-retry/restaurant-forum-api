const { Category } = require('../models')

const categoryControllers = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.json(categories))
      .catch(err => next(err))
  }
}

module.exports = categoryControllers
