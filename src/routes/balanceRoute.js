const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { getBalance } = require('../controllers/balanceController')

router.get('', authMiddleware, getBalance)

module.exports = router