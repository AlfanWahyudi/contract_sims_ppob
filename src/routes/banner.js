const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { getAllBanners } = require('../controllers/bannerController')

router.get('/', authMiddleware, getAllBanners)

module.exports = router