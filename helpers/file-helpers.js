const fs = require('fs').promises
const path = require('path')

const uploadDir = 'upload'

const localFileHandler = file => {
  if (!file) return Promise.resolve(null)

  const fileName = path.join(uploadDir, file.originalname)

  return fs.readFile(file.path)
    .then(data => fs.writeFile(path.join(__dirname, '..', fileName), data))
    .then(() => `/${fileName}`)
    .catch(err => {
      console.error('Failed to handle local file:', err)
      throw err
    })
}

module.exports = {
  localFileHandler
}
