const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { doTopup } = require('../controllers/topupController')
const { validateTopup } = require('../validators/topupValidator')

router.post('', authMiddleware, validateTopup, doTopup)

module.exports = router
