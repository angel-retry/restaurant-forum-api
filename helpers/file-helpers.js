const fsPromiese = require('fs').promises
const fs = require('fs')
const path = require('path')
const { ImgurClient } = require('imgur')

const uploadDir = 'upload'

const localFileHandler = file => {
  if (!file) return Promise.resolve(null)

  const fileName = path.join(uploadDir, file.originalname)

  return fsPromiese.readFile(file.path)
    .then(data => fsPromiese.writeFile(path.join(__dirname, '..', fileName), data))
    .then(() => `/${fileName}`)
    .catch(err => {
      console.error('Failed to handle local file:', err)
      throw err
    })
}
const imgurFileHandler = file => {
  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN
  })
  return client.upload({
    image: fs.createReadStream(file.path),
    type: 'stream'
  })
    .then(imagurData => {
      const url = imagurData.data.link
      return url
    })
    .catch(err => {
      console.error('Imgur上傳圖片失敗', err)
      throw err
    })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
