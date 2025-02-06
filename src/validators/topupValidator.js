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
}