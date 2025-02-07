const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const { getAllServicesData } = require('../services/serviceDataService')

exports.getAllServices = async (req, res) => {
  try {
    const serviceItems = await getAllServicesData()
  
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