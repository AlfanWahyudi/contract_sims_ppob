const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const { topup } = require('../services/transactionService')
const { updateBalance, getUserByEmail } = require('../services/userService')

exports.doTopup = async (req, res) => {
  try {
    const result = await sequelize.transaction(async t => {
      const user = await  getUserByEmail(req.userData.email) 
      
      if (user === null) {
        throw new Error("Email tidak ditemukan")
      }

      let prevBalance = 0
      prevBalance = parseInt(user.balance)
      const newBalance = prevBalance + req.body.top_up_amount

      const [results, metadata] = await updateBalance({
        newBalance: newBalance,
        email: req.userData.email,
        transaction: t,
      })

      await topup({
        amount: req.body.top_up_amount,
        email: req.userData.email,
        transaction: t,
      })

      return {
        balance: newBalance
      }
    })

    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        ...result
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
