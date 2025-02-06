const Joi = require('joi')

exports.validateLogin = (req, res, next) => {
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
  })

  next()
}