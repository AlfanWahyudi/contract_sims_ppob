const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')


exports.getAllBanners = async (req, res) => {
  try {
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
        data: [...bannerItems.map(banner => ({...banner}))],
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null,
    })
  }
}