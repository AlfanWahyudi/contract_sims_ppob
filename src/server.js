require('dotenv').config()

const http = require('http')
const app = require('./app')
const initFolder = require('./init-folder')

const { sequelize } = require('./database/database-config')

const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync();

      initFolder.run()
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
})