const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { getProfile, updateProfile, uploadProfileImg } = require('../controllers/profileController')
const { validateUpdateProfile } = require('../validators/updateProfileValidator')
const upload = require('../middlewares/uploadProfileMiddleware')

router.get('/', authMiddleware, getProfile)
router.put('/update', authMiddleware, validateUpdateProfile, updateProfile)
router.put('/image', authMiddleware, upload.single('file'), uploadProfileImg)

module.exports = router