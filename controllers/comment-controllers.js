const { Comment, Restaurant, User, Category } = require('../models')

const commentControllers = {
  postComments: (req, res, next) => {
    const { restaurantId } = req.params
    const { text } = req.body
    const userId = req.user.id

    if (!userId) {
      const err = new Error('沒有取得使用者資料!')
      err.status = 401
      throw err
    }

    if (!text) {
      const err = new Error('請輸入內容!')
      err.status = 400
      throw err
    }

    return Comment.create({
      userId,
      text,
      restaurantId
    })
      .then(newComment => {
        return res.json({
          status: 'success',
          newComment
        })
      })
      .catch(err => next(err))
  },
  getFeedsComments: (req, res, next) => {
    return Comment.findAll({
      include: [
        { model: Restaurant, attributes: ['id', 'name', 'categoryId', 'image'], include: [{ model: Category, attributes: ['id', 'name'] }] },
        { model: User, attributes: ['id', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    })
      .then(feedsComments => {
        return res.json({
          feedsComments
        })
      })
      .catch(err => next(err))
  }
}

module.exports = commentControllers
