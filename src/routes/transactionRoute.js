const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth-middleware')
const { getAllTransactionHistories, doPayment } = require('../controllers/transactionController')
const { validateTransaction } = require('../validators/transactionValidator')

router.post('', authMiddleware, validateTransaction, doPayment)
router.get('/history', authMiddleware, getAllTransactionHistories)

module.exports = router