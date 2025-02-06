const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')

exports.validateTransaction = async (req, res, next) => {
  const schema = Joi.object({
    service_code: Joi.string()
      .required()
      .messages({
        'any.required': `service_code is required field`
      }),
  })

  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ 
    status: 102,
    message: error.details[0].message,
    data: null 
  }); 

  const service = await sequelize.query(
    `SELECT * FROM services WHERE service_code = $service_code`,
    {
      bind: {
        service_code: req.body.service_code
      },
      type: QueryTypes.SELECT
    }
  )

  if (service.length === 0) {
    return res.status(400).json({ 
      status: 102,
      message: "Service ataus Layanan tidak ditemukan",
      data: null 
    }); 
  } else {
    const user = await sequelize.query(
      `SELECT balance FROM users WHERE email = $email`,
      {
        bind: {
          email: req.userData.email
        },
        type: QueryTypes.SELECT
      }
    )
  
    const balance = parseInt(user[0].balance)
    const tariff = parseInt(service[0].service_tariff)
    if (balance < tariff) {
      return res.status(400).json({ 
        status: 102,
        message: "Balance tidak mencukupi",
        data: null 
      }); 
    }
  }

  next()
}