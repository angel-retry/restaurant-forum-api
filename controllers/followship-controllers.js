const { User, Followship } = require('../models')

const followeshipControllers = {
  postFollowing: (req, res, next) => {
    const { followingId } = req.params
    const userId = req.user.id
    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId
        }
      })]
    )
      .then(([followingUser, followship]) => {
        if (!followingUser) {
          const err = new Error('沒有此使用者!')
          err.status = 404
          throw err
        }

        if (followship) {
          const err = new Error('你已追蹤此使用者!')
          err.status = 400
          throw err
        }

        return Followship.create({
          followerId: userId,
          followingId
        })
      })
      .then(newFollowship => {
        return res.json({
          newFollowship
        })
      })
      .catch(err => next(err))
  },
  deleteFollowing: (req, res, next) => {
    const { followingId } = req.params
    const userId = req.user.id
    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId
        }
      })]
    )
      .then(([followingUser, followship]) => {
        if (!followingUser) {
          const err = new Error('沒有此使用者!')
          err.status = 404
          throw err
        }

        if (!followship) {
          const err = new Error('你沒有追蹤此使用者!')
          err.status = 400
          throw err
        }

        return followship.destroy()
      })
      .then(deleteFollowship => {
        return res.json({
          deleteFollowship
        })
      })
      .catch(err => next(err))
  }
}

module.exports = followeshipControllers
