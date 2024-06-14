require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const passport = require('./config/passport')
const router = require('./routes')
const session = require('express-session')
const path = require('path')
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
