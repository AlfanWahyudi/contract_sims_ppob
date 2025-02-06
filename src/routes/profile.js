const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')
const authMiddleware = require('../middlewares/auth-middleware')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.env.IMG_PATH}/`)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|png/;

  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true)
    return
  }

  cb(new Error("filter-image:Format Image tidak sesuai"));
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

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
        .required()
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
        resJson.message = "Update Pofile berhasil"
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

router.put('/image', authMiddleware, upload.single('file'), async (req, res, next) => {
  let statusCode = 200
  const resJson = {
    status: 0,
    message: "",
    data: null,
  }

  try {
    if (req.file === undefined) {
      statusCode = 200
      resJson.status = 102
      resJson.message = "File tidak boleh kosong"
      resJson.data = null

    } else {
    
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
            email: req.userData.email
          },
          type: QueryTypes.SELECT
        }
      )
    
      if (userItems.length > 0) {
        const [results, metadata] = await sequelize.query(
          `
            UPDATE users
            SET img_file_name = :img_file_name
            WHERE email = :email;
          `,
          {
            replacements: {
              img_file_name: req.file.filename,
              email: req.userData.email,
            },
            type: QueryTypes.UPDATE
          }
        )
    
        if (metadata > 0) {
          if (userItems[0].profile_img !== "") {
            const profileImgSplitted = userItems[0].profile_img.split('/')
            const filename = profileImgSplitted[profileImgSplitted.length - 1]
            
            const filePath = path.join(process.cwd(), process.env.IMG_PATH, filename)
            
            fs.unlinkSync(filePath)
          }
          
          statusCode = 200
          resJson.status = 0
          resJson.message = "Update Profile Image berhasil"          
          resJson.data = {
            ...userItems[0],
            profile_img: `${GeneratorUtil.img_path_url()}${req.file.filename}`
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    statusCode = 500
    resJson.status = 500
    resJson.message = error.message
    resJson.data = null
  }

  return res.status(statusCode).json(resJson)
})

module.exports = router