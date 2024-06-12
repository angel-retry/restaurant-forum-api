const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ status: 'error', message: '請登入帳號!' })
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ status: 'error', message: '請登入帳號!' })
    req.user = user
    if (user || user.isAdmin) return next()
    return res.status(403).json({ status: 'error', message: '沒有權限!' })
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
