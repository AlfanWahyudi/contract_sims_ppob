const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/', authMiddleware, async (req, res, next) => {
  //TODO: handle if error while getting data 
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
      data: serviceItems,
    })    
  }   
})

module.exports = router