const express = require('express')
const router = express.Router()

const { register, login } = require('../controllers/authController')
const { validateLogin } = require('../validators/loginValidator')
const { validateRegister } = require('../validators/registerValidator')

router.post('/registration', validateRegister, register)
router.post('/login', validateLogin, login)

module.exports = router