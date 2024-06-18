require('dotenv').config()
require('./Database/config')
const Server = require('./server/server')
const server = new Server(); 
server.listen()


