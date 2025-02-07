const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const { getAllBanners } = require('../services/bannerService')


exports.getAllBanners = async (req, res) => {
  try {
    const bannerItems = await getAllBanners()
    if (bannerItems.length > 0) {
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: [...bannerItems.map(banner => ({
          banner_name: banner.banner_name,
          banner_image: banner.banner_image,
          description: banner.description
        }))],
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