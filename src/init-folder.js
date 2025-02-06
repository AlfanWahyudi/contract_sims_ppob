const fs = require('fs');

const folderPathItems = [
  process.env.IMG_PATH
] 

exports.run = () => {
  for (const folderPath of folderPathItems) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Folder path '${folderPath}' created successfully!`);
    } else {
      console.log(`Folder path '${folderPath}' already exists.`);
    }
  }
}

