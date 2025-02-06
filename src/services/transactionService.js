const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const { getTimestampStr } = require('../utils/date-util')


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
    console.log(highest)

  } else {
    invoice += '-001'
  }

  return invoice
}


const getTransaction = (invoice_number) => {

}

const topup = async ({amount, email}) => {
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
      type: QueryTypes.INSERT
    }
  )

  return {
    balance: amount
  }
}

const payment = async ({amount, email, serviceCode}) => {

}


module.exports = {
  topup,
  payment,
  getTransaction
}