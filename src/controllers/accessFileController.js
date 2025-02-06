const fs = require('fs')
const path = require('path')

exports.getSpecificFile = (req, res) => {
  const filePath = path.join(process.cwd(), process.env.IMG_PATH, req.params.filename)
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
}