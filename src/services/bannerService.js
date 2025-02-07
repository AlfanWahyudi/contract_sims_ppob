const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')

const getAllBanners = async () => {
  return await sequelize.query(
    "SELECT * FROM banners ORDER BY banner_name asc",
    {
      type: QueryTypes.SELECT
    }
  )
}

module.exports = {
  getAllBanners
}