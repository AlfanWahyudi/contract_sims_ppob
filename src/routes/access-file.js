const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.get('/img-file/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), process.env.IMG_PATH, req.params.filename)
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
})

module.exports = router