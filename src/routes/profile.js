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
      resJson.data = {...userItems[0]}
    }
  } catch (error) {
    statusCode = 500
    resJson.status = 500
    resJson.message = error.message
    resJson.data = null
  }

  return res.status(statusCode).json(resJson)
})

router.put('/update', authMiddleware, async (req, res, next) => {
  let statusCode = 200
  const resJson = {
    status: 0,
    message: "",
    data: null,
  }

  try {
    const userSchema = Joi.object({
      first_name: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
          'string.base': `first_name seharusnya bertipe 'text'`,
          'string.empty': `first_name tidak boleh kosong`,
          'string.max': `Panjang first_name tidak boleh melebihi {#limit} karakter`,
          'any.required': `first_name is required field`
        }),
  
      last_name: Joi.string()
        .trim()
        .max(255)
        .messages({
          'string.base': `last_name seharusnya bertipe 'text'`,
          'string.max': `Panjang last_name tidak boleh melebihi {#limit} karakter`,
          'any.required': `last_name is required field`
        }),
    })
  
    await userSchema.validateAsync(req.body)

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
      const [results, metadata] = await sequelize.query(
        `
          UPDATE users
          SET first_name = :first_name, last_name= :last_name
          WHERE email = :email;
        `,
        {
          replacements: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.userData.email
          },
          type: QueryTypes.UPDATE
        }
      )

      if (metadata > 0) {
        statusCode = 200
  
        resJson.status = 0
        resJson.message = "Sukses"
        resJson.data = {
          ...userItems[0],
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        }
      }
    }

  
  } catch (error) {
    statusCode = 500
    resJson.status = 500
    resJson.message = error.message
    resJson.data = null
    
    if (error instanceof Joi.ValidationError) {
      statusCode = 400
      resJson.status = 102
    }
  }
  
  return res.status(statusCode).json(resJson)
})

router.put('/image', (req, res, next) => {
 //TODO:
})

module.exports = router