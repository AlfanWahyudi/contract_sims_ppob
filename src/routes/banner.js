const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/', authMiddleware, async (req, res, next) => {
  //TODO: handle if error while getting data 
  const bannerItems = await sequelize.query(
    "SELECT banner_name, banner_image, description FROM banners ORDER BY banner_name asc",
    {
      type: QueryTypes.SELECT
    }
  )

  if (bannerItems.length > 0) {
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: bannerItems,
    })    
  }   
})

module.exports = router