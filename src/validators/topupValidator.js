// const Joi = require('joi')

exports.validateTopup = async(req, res, next) => {

  const amount = req.body.top_up_amount

  if (
      amount === undefined ||
      typeof amount !== 'number' ||
      amount <= 0
  ) {
    return res.status(400).json({ 
      status: 102,
      message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      data: null 
    }); 
  }

  next();
  
  // const schema = Joi.object({
  //   top_up_amount: Joi.number()
  //     .min(1)
  //     .required()
  //     .messages({
  //       'string.base': `email seharusnya bertipe 'text'`,
  //       'string.empty': `email tidak boleh kosong`,
  //       'string.max': `Panjang email tidak boleh melebihi {#limit} karakter`,
  //       'any.required': `email is required field`
  //     }),
      
  // })
}