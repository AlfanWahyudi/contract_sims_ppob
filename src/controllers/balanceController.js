const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')

exports.getBalance = async (req, res) => {
  try {
    const userItems = await sequelize.query(
      "SELECT balance FROM users WHERE email = :email",
      {
        replacements: {
          email: req.userData.email
        },
        type: QueryTypes.SELECT
      }
    )

    if (userItems.length > 0) {
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: [...userItems.map(user => 
          (
            { balance: parseInt(user.balance) }
          )
        )],
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