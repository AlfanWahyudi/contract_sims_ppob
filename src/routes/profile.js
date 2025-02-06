const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')
const authMiddleware = require('../middlewares/auth-middleware')

const GeneratorUtil = require('../utils/generator-util')

router.get('/', authMiddleware, async (req, res, next) => {
  let statusCode = 200
  const resJson = {
    status: 0,
    message: "",
    data: null,
  }

  try {
    const userItems = await sequelize.query(
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
          email: req.userData.email
        },
        type: QueryTypes.SELECT
      }
    )
  
    if (userItems.length > 0) {
      statusCode = 200
      resJson.status = 0
      resJson.message = "Sukses"
      resJson.data = userItems[0]
    }
  } catch (error) {
    statusCode = 500
    resJson.status = 500
    resJson.message = error.message
    resJson.data = null
  }

  return res.status(statusCode).json(resJson)
})

router.put('/update', authMiddleware, (req, res, next) => {
 //TODO:
})

router.put('/image', (req, res, next) => {
 //TODO:
})

module.exports = router