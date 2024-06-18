const express = require('express')

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
