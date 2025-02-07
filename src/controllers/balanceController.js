const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')


const { getUserByEmail } = require('../services/userService')

exports.getBalance = async (req, res) => {
  try {
    const user = await getUserByEmail(req.userData.email) 

    if (user === null) {
      throw new Error("Email tidak ditemukan")
    }

    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: parseInt(user.balance)
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null,
    })
  }
}