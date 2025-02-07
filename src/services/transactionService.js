const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const { getTimestampStr } = require('../utils/date-util')

const { getUserByEmail, updateBalance } = require('../services/userService')


const generateNewInvoice = async () => {
  const date = new Date();
  const formattedDate = String(date.getDate()).padStart(2, "0") + 
    String(date.getMonth() + 1).padStart(2, "0") +  
    date.getFullYear().toString()

  
  let invoice = `INV${formattedDate}`

  const transactionItems = await sequelize.query(
    `
      SELECT invoice_number FROM transactions WHERE invoice_number LIKE :startWith
    `,
    {
      replacements: {
        startWith: `INV${formattedDate}%`,
      },
      type: QueryTypes.SELECT
    }
  )

  if (transactionItems.length > 0) {
    const highest = transactionItems.reduce((max, data) => {
      const numberStr = data.invoice_number.split('-')[1]
      const num = parseInt(numberStr)

      return num > max ? num : max
    }, 0)

    const increment = highest + 1
    invoice += '-' + String(increment).padStart(3, "0")
  } else {
    invoice += '-001'
  }

  return invoice
}

const getAllTransactions = async ({email, limit = 0, offset = 0}) => {
  const transactionItems = await sequelize.query(
    `
      SELECT
        invoice_number,
        (
          CASE
            WHEN is_top_up = true THEN 'TOPUP'
            WHEN is_top_up = false THEN 'PAYMENT'
          END
        ) AS transaction_type,
        description,
        total_amount,
        TO_CHAR(created_on, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')  as created_on
      FROM
        transactions
      WHERE
        user_email = $email
      LIMIT $limit OFFSET $offset
    `,
    {
      bind: {
        email: email,
        limit: limit,
        offset: offset
      },
      type: QueryTypes.SELECT
    }
  )

  return transactionItems.map((item) => {
    return {  
      ...item,
      total_amount: parseInt(item.total_amount)
    }
  })
}

const topup = async ({amount, email, transaction}) => {
  const newInvoice = await generateNewInvoice()

  await sequelize.query(
    `
      INSERT INTO transactions 
        (invoice_number, user_email, total_amount, description, is_top_up, service_code, created_on)
      VALUES
      ($invoice_number, $user_email, $total_amount, $description, $is_top_up, $service_code, $created_on)
    `,
    {
      bind: {
        invoice_number: newInvoice,
        user_email: email, 
        total_amount: amount, 
        description: 'Top Up balance', 
        is_top_up: true,
        service_code: null, 
        created_on: getTimestampStr(),
      },
      type: QueryTypes.INSERT,
      transaction: transaction
    }
  )
}

const payment = async ({email, service, transaction}) => {
  const newInvoice = await generateNewInvoice()

  await sequelize.query(
    `
      INSERT INTO transactions 
        (invoice_number, user_email, total_amount, description, is_top_up, service_code, created_on)
      VALUES
      ($invoice_number, $user_email, $total_amount, $description, $is_top_up, $service_code, $created_on)
    `,
    {
      bind: {
        invoice_number: newInvoice,
        user_email: email, 
        total_amount: parseInt(service.service_tariff), 
        description: service.service_name, 
        is_top_up: false,
        service_code: service.service_code, 
        created_on: getTimestampStr(),
      },
      type: QueryTypes.INSERT,
      transaction: transaction,
    }
  )

  const user = await getUserByEmail(email)
  if (user === null) {
    throw new Error("Email tidak ditemukan")
  }

  const balance = parseInt(user.balance)
  const tariff = parseInt(service.service_tariff)
  const newBalance = balance - tariff

  const [results, metadata] = await updateBalance({
    email,
    newBalance,
    transaction
  })

  return {
    invoice_number: newInvoice,
    service_code: service.service_code,
    service_name: service.service_name,
    transaction_type: "PAYMENT",
    total_amount: tariff,
    created_on: getTimestampStr()
  }
}

module.exports = {
  topup,
  payment,
  getAllTransactions,
}