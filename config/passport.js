const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  (email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false)
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return cb(null, false)
            return cb(null, user)
          })
          .catch(err => cb(err))
      })
      .catch(err => cb(err))
  }))

module.exports = passport
