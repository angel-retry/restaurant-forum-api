const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

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

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  console.log('jwtPayload.id', jwtPayload.id)
  return User.findByPk(jwtPayload.id, {
    include: [
      {
        model: Restaurant,
        as: 'LikedRestaurants'
      },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      cb(null, user)
    })
    .catch(err => cb(err))
}))

// passport.serializeUser((user, done) => {
//   return done(null, user.id)
// })

// passport.deserializeUser((id, done) => {
//   User.findByPk(id, {
//     include: [
//       { model: Restaurant, as: 'SavedRestaurants' },
//       { model: Restaurant, as: 'LikedRestaurants' },
//       { model: User, as: 'Followers' },
//       { model: User, as: 'Followings' }
//     ]
//   })
//     .then(user => {
//       user = user.toJSON()
//       console.log(user)
//       return done(null, user)
//     })
// })

module.exports = passport
