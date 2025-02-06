const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

        await sequelize.query(
          "INSERT INTO users (email, first_name, last_name, password) VALUES ($email, $first_name, $last_name, $password)",
          {
            bind:{
              email: req.body.email,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              password: hash
            },
            type: QueryTypes.INSERT
          }
        )

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
  const user = await sequelize.query(
    "SELECT * from users WHERE email = $1",
    {
      bind: [req.body.email],
      type: QueryTypes.SELECT
    }
  )

  if (user.length > 0) {
    bcrypt.compare(req.body.password, user[0].password)
      .then(result => {
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h" //TODO:change to 12h now its (3 minute)
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
  } else {
    return res.status(401).json({
      status: 103,
      message: "Username atau password salah",
      data: null
    })
  }
}