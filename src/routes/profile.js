const express = require('express')
const router = express.Router()
const { sequelize } = require('../database/database-config')
const { QueryTypes } = require('sequelize')
const Joi = require('joi')
const authMiddleware = require('../middlewares/auth-middleware')

router.get('/', authMiddleware, async (req, res, next) => {
  //TODO: handle if error while getting data 
  //TODO: handle query to return a full url of profile_img
  const userItems = await sequelize.query(
    "SELECT email, first_name, last_name, img_file_name as profile_img FROM users WHERE email = $1",
    {
      bind: [req.userData.email],
      type: QueryTypes.SELECT
    }
  )

  if (userItems.length > 0) {
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: userItems[0],
    })    
  }   
})

router.put('/update', authMiddleware, (req, res, next) => {
 //TODO:
})

router.put('/image', (req, res, next) => {
 //TODO:
})

module.exports = router