const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.env.IMG_PATH}/`)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|png/;

  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true)
    return
  }

  cb(new Error("filter-image:Format Image tidak sesuai"));
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})


module.exports = upload