const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
const passportJWT = require('passport-jwt')
const GoogleStrategy = require('passport-google-oauth2').Strategy

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, cb) => {
  const email = profile.email
  const name = profile.displayName
  const avatar = profile.picture

  User.findOne({ where: { email } })
    .then(user => {
      if (user) return cb(null, user)

      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then(hash => {
          return User.create({ name, email, password: hash, avatar })
        })
        .then(newUser => {
          return cb(null, newUser)
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
        as: 'LikedRestaurants',
        attributes: ['id']
      },
      {
        model: Restaurant,
        as: 'SavedRestaurants',
        attributes: ['id']
      },
      {
        model: User,
        as: 'Followers',
        attributes: ['id']
      },
      {
        model: User,
        as: 'Followings',
        attributes: ['id']
      }
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
