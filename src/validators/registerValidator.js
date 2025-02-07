const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')

exports.validateRegister = async (req, res, next) => {
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
      .required()
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

  const userItems = await sequelize.query(
    "SELECT * FROM users WHERE email = $1",
    {
      bind: [req.body.email],
      type: QueryTypes.SELECT
    }
  )

  if (userItems.length > 0) {
    return res.status(400).json({ 
      status: 102,
      message: "email sudah digunakan",
      data: null 
    })
  }

  next();
}