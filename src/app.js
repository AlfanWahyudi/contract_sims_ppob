const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const authRoutes = require('./routes/authRoute')
const profileRoutes = require('./routes/profileRoute')
const bannerRoutes = require('./routes/bannerRoute')
const serviceRoutes = require('./routes/serviceRoute')
const balanceRoutes = require('./routes/balanceRoute')
const topupRoutes = require('./routes/topupRoute')
const transactionRoutes = require('./routes/transactionRoute')
const accessFileRoutes = require('./routes/accessFileRoute')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('', authRoutes);
app.use('/profile', profileRoutes);
app.use('/banner', bannerRoutes);
app.use('/services', serviceRoutes);
app.use('/balance', balanceRoutes);
app.use('/topup', topupRoutes);
app.use('/transaction', transactionRoutes);
app.use('', accessFileRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  let status = 500
  let message = error.message

  if (message.includes('filter-image:')) {
    status = 102
    message = message.split(':')[1]
  }

  res.status(error.status || 500);
  res.json({
    status: status,
    message: message,
    data: null
  });
});

module.exports = app