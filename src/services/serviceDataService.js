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

const getServiceByCode = async (serviceCode) => {
  const services = await sequelize.query(
    `SELECT * from services WHERE service_code = $service_code`,
    {
      bind: {
        service_code: serviceCode
      },
      type: QueryTypes.SELECT,
    }
  )

  return services.length ? services[0] : null
}

module.exports = {
  getAllServicesData,
  getServiceByCode
}