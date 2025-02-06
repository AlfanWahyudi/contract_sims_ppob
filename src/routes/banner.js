const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/', authMiddleware, async (req, res, next) => {
  let statusCode = 200
  const resJson = {
    status: 0,
    message: "",
    data: null
  }

  try {
    const bannerItems = await sequelize.query(
      "SELECT banner_name, banner_image, description FROM banners ORDER BY banner_name asc",
      {
        type: QueryTypes.SELECT
      }
    )
  
    if (bannerItems.length > 0) {
      statusCode = 200

      resJson.status = 0
      resJson.message = "Sukses"
      resJson.data = bannerItems
    }
  } catch (error) {
    statusCode = 500

    resJson.status = 500
    resJson.message = error.message
    resJson.data = null
  }

  return res.status(statusCode).json(resJson)
})

module.exports = router