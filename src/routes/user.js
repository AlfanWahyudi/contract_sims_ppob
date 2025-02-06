const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//TODO: cleaning routes code
router.post('/registration', async (req, res, next) => {
  const email = req.body.email
  const firstName = req.body.first_name
  const lastName = req.body.last_name
  const password = req.body.password

  //validate email
  const student = await sequelize.query(
    "SELECT * FROM users WHERE email = $1",
    {
      bind: [email],
      type: QueryTypes.SELECT
    }
  )

  if (student.length > 0) {
    return res.status(400).json({ 
      status: 102,
      message: "email sudah digunakan",
      data: null 
    })
  }

  //validate with joi
  const userSchema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .max(255)
      .required()
      .messages({
        'string.base': `email seharusnya bertipe 'text'`,
        'string.empty': `email tidak boleh kosong`,
        'string.max': `Panjang email tidak boleh melebihi {#limit} karakter`,
        'any.required': `email is required field`
      }),
      

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

    password: Joi.string()
      .trim()
      .min(8)
      .max(16)
      .required()
      .messages({
        'string.base': `password seharusnya bertipe 'text'`,
        'string.empty': `password tidak boleh kosong`,
        'string.max': `Panjang password tidak boleh melebihi {#limit} karakter`,
        'string.min': `Panjang password tidak boleh kurang dari {#limit} karakter`,
        'any.required': `password is required field`
      }),
  })

  const { error } = userSchema.validate(req.body)
  if (error) return res.status(400).json({ 
    status: 102,
    message: error.details[0].message,
    data: null 
  }); 

  bcrypt.hash(password, 10, async (err, hash) => {
    console.log(hash)
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Gagal untuk encrypt password",
        data: null
      });
    }

    //insert to DB
    await sequelize.query(
      "INSERT INTO users (email, first_name, last_name, password) VALUES ($email, $first_name, $last_name, $password)",
      {
        bind:{
          email: email,
          first_name: firstName,
          last_name: !lastName ? null : lastName,
          password: hash
        },
        type: QueryTypes.INSERT
      }
    )
  
    //return response
    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });
  })
})

router.post('/login',  async (req, res, next) => {
  const userSchema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .max(255)
      .required()
      .messages({
        'string.base': `email seharusnya bertipe 'text'`,
        'string.empty': `email tidak boleh kosong`,
        'string.max': `Panjang email tidak boleh melebihi {#limit} karakter`,
        'any.required': `email is required field`
      }),

    password: Joi.string()
      .trim()
      .max(16)
      .required()
      .messages({
        'string.base': `password seharusnya bertipe 'text'`,
        'string.empty': `password tidak boleh kosong`,
        'string.max': `Panjang password tidak boleh melebihi {#limit} karakter`,
        'any.required': `password is required field`
      }),
  })

  const { error } = userSchema.validate(req.body)
  if (error) return res.status(400).json({ 
    status: 102,
    message: error.details[0].message,
    data: null 
  }); 

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
              expiresIn: "30000ms" //TODO:change to 12h 
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
        return res.status(401).json({
          status: 103,
          message: "Username atau password salah",
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
})

module.exports = router