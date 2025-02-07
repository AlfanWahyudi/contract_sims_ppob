const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')

const GeneratorUtil = require('../utils/generator-util')

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

const getProfileByEmail = async (email) => {
  const users = await sequelize.query(
    `
      SELECT 
        email, 
        first_name, 
        (
          CASE
            WHEN last_name IS NULL THEN ''
            ELSE last_name
          END
        ) AS last_name,
        (
          CASE
            WHEN img_file_name IS NULL THEN ''
            WHEN img_file_name = '' THEN ''
            ELSE concat(:imgPathUrl, img_file_name)
          END
        ) AS profile_img
      FROM 
        users 
      WHERE 
        email = :email
    `,
    {
      replacements: {
        imgPathUrl: GeneratorUtil.img_path_url(),
        email: email
      },
      type: QueryTypes.SELECT
    }
  )

  return users.length ? users[0] : null;
}

const updateProfile = async ({firstName, lastName, email}) => {
  return await sequelize.query(
    `
      UPDATE users
      SET first_name = :first_name, last_name= :last_name
      WHERE email = :email;
    `,
    {
      replacements: {
        first_name: firstName,
        last_name: lastName,
        email: email
      },
      type: QueryTypes.UPDATE
    }
  )
}

const updateProfileImage = async ({email, filename, transaction}) => {
  return await sequelize.query(
    `
      UPDATE users
      SET img_file_name = :img_file_name
      WHERE email = :email;
    `,
    {
      replacements: {
        img_file_name: filename,
        email: email,
      },
      type: QueryTypes.UPDATE,
      transaction: transaction,
    }
  )
}

module.exports = {
  getUserByEmail,
  createUser,
  getProfileByEmail,
  updateProfile,
  updateProfileImage
}