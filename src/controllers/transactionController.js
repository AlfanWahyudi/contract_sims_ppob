const { getAllTransactions } = require("../services/transactionService")


exports.doPayment = (req, res) => {
  //TODO
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