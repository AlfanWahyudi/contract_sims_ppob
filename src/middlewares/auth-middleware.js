const jwt = require('jsonwebtoken');
const { ValidationError } = require('sequelize');

module.exports = (req, res, next) => {
  try {
		if (
			req.headers.authorization === undefined ||
			req.headers.authorization === ""
		) {
			throw new ValidationError("Authorization on Headers must be not empty");
		}

		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;
		next();
  } catch (error) {
		if (error instanceof ValidationError) {
			return res.status(400).json({
				"status": 102,
				"message": error.message,
				"data": null
			});
		}

		return res.status(401).json({
			"status": 108,
			"message": "Token tidak tidak valid atau kadaluwarsa",
			"data": null
		});
  }
}