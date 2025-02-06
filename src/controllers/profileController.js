const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')
const authMiddleware = require('../middlewares/auth-middleware')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const GeneratorUtil = require('../utils/generator-util')

exports.getProfile = async (req, res) => {
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
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {...userItems[0]}
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}

exports.updateProfile = async (req, res) => {
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
        return res.status(200).json({
          status: 0,
          message: "Update Profile berhasil",
          data: {
            ...userItems[0],
            first_name: req.body.first_name,
            last_name: req.body.last_name,
          }
        })
      }
    }

  
  } catch (error) {
    let statusCode = 500
    const resJson = {
      status: 500,
      message: error.message,
      data: null
    }
    
    if (error instanceof Joi.ValidationError) {
      statusCode = 400
      resJson.status = 102
    }

    return res.status(statusCode).json(resJson)
  }
}

exports.uploadProfileImg = async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({
        status: 102,
        message: "File tidak boleh kosong",
        data: null
      })
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

          return res.status(200).json({
            status: 0,
            message: "Update Profile Image berhasil",
            data: {
              ...userItems[0],
              profile_img: `${GeneratorUtil.img_path_url()}${req.file.filename}`
            }    
          })
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}