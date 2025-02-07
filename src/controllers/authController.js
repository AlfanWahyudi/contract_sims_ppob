const { sequelize } = require('../database/dbConnection')
const { QueryTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { getUserByEmail, createUser } = require('../services/userService')

exports.register = async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Gagal untuk encrypt password",
          data: null
        })
      } else {
        const [results, metadata] = await createUser({
          email: req.body.email,
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          passwordHash: hash
        })

        return res.status(200).json({
          status: 0,
          message: "Registrasi berhasil silahkan login",
          data: null
        })
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    })
  }
}

exports.login = async (req, res) => {
  const user = await getUserByEmail(req.body.email)

  if (user === null) {
    return res.status(401).json({
      status: 103,
      message: "Username atau password salah",
      data: null
    })
  }

  bcrypt.compare(req.body.password, user.password)
    .then(result => {
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "12h"
          }
        )
        return res.status(200).json({
          status: 0,
          message: "Login Sukses",
          data: {
            token: token
          }
        })
      } else {
        return res.status(401).json({
          status: 103,
          message: "Username atau password salah",
          data: null
        })
      }
    })
    .catch(err => {
      return res.status(500).json({
        status: 500,
        message: err.message,
        data: null
      })
    })

}