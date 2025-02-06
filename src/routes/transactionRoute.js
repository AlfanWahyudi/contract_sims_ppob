const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { getAllTransactionHistories } = require('../controllers/transactionController')

router.get('/history', authMiddleware, getAllTransactionHistories)

module.exports = router