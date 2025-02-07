const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')

const { removeImageFile } = require('../utils/fileUtil')
const GeneratorUtil = require('../utils/generator-util')
const { getProfileByEmail, updateProfile, updateProfileImage } = require('../services/userService')

exports.getProfile = async (req, res) => {
  try {
    const profile = await getProfileByEmail(req.userData.email)

    if (profile === null) {
      throw new Error("Email tidak ditemukan")
    }
  
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {...profile}
    })
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
    const profile = await getProfileByEmail(req.userData.email)

    if (profile === null) {
      throw new Error("Email tidak ditemukan")
    }

    const [results, metadata] = await updateProfile({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.userData.email
    }) 

    if (metadata > 0) {
      return res.status(200).json({
        status: 0,
        message: "Update Profile berhasil",
        data: {
          ...profile,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        }
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

exports.uploadProfileImg = async (req, res) => {
  try {
    if (req.file !== undefined) {
      const result = await sequelize.transaction(async t => {
        const profile = await getProfileByEmail(req.userData.email)

        if (profile === null) {
          throw new Error("Email tidak ditemukan")
        }

        const [results, metadata] = await updateProfileImage({
          filename: req.file.filename,
          email: req.userData.email,
          transaction: t,
        })
        
        if (profile.profile_img !== "") {
          const profileImgSplitted = profile.profile_img.split('/')
          const filename = profileImgSplitted[profileImgSplitted.length - 1]
          removeImageFile(filename)
        }

        return {
          ...profile,
          profile_img: `${GeneratorUtil.img_path_url()}${req.file.filename}`
        }
      })

      return res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: result 
      })
    }
  } catch (error) {
    if (req.file !== undefined) {
      removeImageFile(req.file.filename)
    }

    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}