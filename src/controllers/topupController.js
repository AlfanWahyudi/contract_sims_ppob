const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const { topup } = require('../services/transactionService')



exports.doTopup = async (req, res) => {
  // const client = await 
  try {
    const user = await sequelize.query(
      "SELECT balance FROM users WHERE email = :email",
      {
        replacements: {
          email: req.userData.email
        },
        type: QueryTypes.SELECT
      }
    )

    let prevBalance = 0
    if (user.length > 0) {
      prevBalance = parseInt(user[0].balance)
    }

    const totalAmount = prevBalance + req.body.top_up_amount
    const [results, metadata] = await sequelize.query(
      `
        UPDATE users
        SET balance = :balance
        WHERE email = :email;
      `,
      {
        replacements: {
          balance: totalAmount,
          email: req.userData.email
        },
        type: QueryTypes.UPDATE
      }
    )

    if (metadata > 0) {
      const result = await topup({
        amount: totalAmount,
        email: req.userData.email
      })

      return res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: {
          ...result,
        }
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
