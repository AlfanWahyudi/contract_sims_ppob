const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()


app.use(cors())
app.use(bodyParser.json());

module.exports = app