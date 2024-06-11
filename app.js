const express = require('express')
const app = express()
const port = 3000

const router = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
