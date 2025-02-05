const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')
const bcrypt = require('bcrypt')



//TODO: cleaning routes code
router.post('/signup', async (req, res, next) => {
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
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .max(255)
      .required()
      .messages({
        'string.base': `email seharusnya bertipe 'text'`,
        'string.empty': `email tidak boleh kosong`,
        'string.max': `Panjang email tidak boleh melebihi {#limit}`,
        'any.required': `email is required field`
      }),
      

    first_name: Joi.string()
      .trim()
      .max(255)
      .required()
      .messages({
        'string.base': `first_name seharusnya bertipe 'text'`,
        'string.empty': `first_name tidak boleh kosong`,
        'string.max': `Panjang first_name tidak boleh melebihi {#limit}`,
        'any.required': `first_name is required field`
      }),

    last_name: Joi.string()
      .trim()
      .max(255)
      .messages({
        'string.base': `last_name seharusnya bertipe 'text'`,
        'string.max': `Panjang last_name tidak boleh melebihi {#limit}`,
        'any.required': `last_name is required field`
      }),

    password: Joi.string()
      .trim()
      .min(8)
      .max(255)
      .required()
      .messages({
        'string.base': `password seharusnya bertipe 'text'`,
        'string.empty': `password tidak boleh kosong`,
        'string.max': `Panjang password tidak boleh melebihi {#limit}`,
        'string.min': `Panjang password tidak boleh kurang dari {#limit}`,
        'any.required': `password is required field`
      }),
  })

  const { error } = await schema.validateAsync(req.body)
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

router.post('/signin', (req, res, next) => {

})

module.exports = router