const fs = require('fs')
const path = require('path')

const removeImageFile = (filename) => {
  fs.unlinkSync(path.join(process.cwd(), process.env.IMG_PATH, filename))
}

module.exports = {
  removeImageFile,
}