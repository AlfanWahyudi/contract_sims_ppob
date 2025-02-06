const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { getAllServices } = require('../controllers/serviceController')

router.get('/', authMiddleware, getAllServices)

module.exports = router