const express = require('express')
const morgan = require('morgan')

class Server {
    constructor() {
      this.app = express()
      this.port = process.env.PORT || 8080
      this.path= '/api'
      this.middlewares()
      this.routes()
    }

    middlewares(){
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }

    routes(){
       this.app.use('/api', require('../routes/user'))
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor en linea', this.port)
        })
    }
}

module.exports = Server
