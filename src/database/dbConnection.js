const { Sequelize } = require('sequelize')

const sslOptions = {}

if (process.env.DB_SSL === "true") {
  sslOptions.ssl = {
    require: true
  }
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  port: process.env.DB_PORT,
  dialectOptions: {
    ...sslOptions
  }
})

module.exports = { sequelize }