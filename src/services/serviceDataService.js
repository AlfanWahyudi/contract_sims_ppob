const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')

const getAllServicesData = async () => {
  return await sequelize.query(
    "SELECT * FROM services ORDER BY service_code asc",
    {
      type: QueryTypes.SELECT
    }
  )
}

module.exports = {
  getAllServicesData
}