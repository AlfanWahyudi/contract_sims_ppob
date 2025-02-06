const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')

exports.getAllServices = async (req, res) => {
  try {
    const serviceItems = await sequelize.query(
      "SELECT * FROM services ORDER BY service_code asc",
      {
        type: QueryTypes.SELECT
      }
    )
  
    if (serviceItems.length > 0) {
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: [...serviceItems.map(service => ({...service}))]
      })
    }   
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}