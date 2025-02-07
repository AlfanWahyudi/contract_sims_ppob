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

const createUser = async ({email, firstName, lastName, passwordHash}) => {
  return await sequelize.query(
    "INSERT INTO users (email, first_name, last_name, password) VALUES ($email, $first_name, $last_name, $password)",
    {
      bind:{
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: passwordHash
      },
      type: QueryTypes.INSERT
    }
  )
}

module.exports = {
  getUserByEmail,
  createUser,
}