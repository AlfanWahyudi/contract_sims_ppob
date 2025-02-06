const Joi = require('joi')

exports.validateUpdateProfile = (req, res, next) => {
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

  const { error } = userSchema.validate(req.body)
  if (error) return res.status(400).json({ 
    status: 102,
    message: error.details[0].message,
    data: null 
  })

  next()
}