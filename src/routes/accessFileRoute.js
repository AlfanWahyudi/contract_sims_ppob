const express = require('express')
const router = express.Router()

const { getSpecificFile } = require('../controllers/accessFileController')

router.get('/img-file/:filename', getSpecificFile)

module.exports = router