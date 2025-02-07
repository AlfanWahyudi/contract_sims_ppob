const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const { getAllTransactions, payment } = require("../services/transactionService")


exports.doPayment = async (req, res) => {
  try {
    const result = await sequelize.transaction(async t => {
      const service = await sequelize.query(
        `SELECT * from services WHERE service_code = $service_code`,
        {
          bind: {
            service_code: req.body.service_code
          },
          type: QueryTypes.SELECT,
          transaction: t,
        }
      )
  
      return await payment({
        email: req.userData.email,
        service: service[0],
        transaction: t,
      })
    })

    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {...result}
    })

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}

exports.getAllTransactionHistories = async (req, res) => {
  let offset = 0
  let limit = 3

  if (
    req.query.offset !== undefined && 
    req.query.offset.trim() !== ''
  ) {
    offset = parseInt(req.query.offset)
  }

  if (      
    req.query.limit !== undefined && 
    req.query.limit.trim() !== ''
  ) {
    limit = parseInt(req.query.limit)
  }

  try {
    const transactionItems = await getAllTransactions({
      email: req.userData.email, 
      limit: limit, 
      offset: offset
    })

    return res.status(200).json({
      offset: offset,
      limit: limit,
      records: [...transactionItems.map(transaction => ({...transaction}))]
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}