const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')

const getUserByEmail = async (email) => {
  const users = await sequelize.query(
    "SELECT * from users WHERE email = $1",
    {
      bind: [email],
      type: QueryTypes.SELECT
    }
  )

  return users.length ? users[0] : null;
}

module.exports = {
  getUserByEmail,
}