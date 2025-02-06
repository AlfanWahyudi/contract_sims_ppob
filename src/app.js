const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const bannerRoutes = require('./routes/banner')
const serviceRoutes = require('./routes/service')
const accessFileRoutes = require('./routes/access-file')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('', authRoutes);
app.use('/profile', profileRoutes);
app.use('/banner', bannerRoutes);
app.use('/services', serviceRoutes);
app.use('', accessFileRoutes);

// app.use('/img-file', express.static('/storage/img'));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: 100, //later change this
    message: error.message,
    data: null
  });
});

module.exports = app