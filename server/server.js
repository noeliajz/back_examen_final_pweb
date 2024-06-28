const express = require('express')
const morgan = require('morgan')

class Server {
    constructor() {
      this.app = express()
      this.port = process.env.PORT || 8080
      this.middlewares()
      this.routes()
    }

    middlewares(){
        this.app.use(express.json())
        this.app.use(morgan('dev'))
      
    }

    routes(){
       
       this.app.use('/api/users', require('../routes/user')),
       this.app.use('/api/doctor', require('../routes/doctor'))
       this.app.use('/api/obraSocial', require('../routes/obraSocial'))

    }
    listen() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))
        this.app.listen(this.port, () => {
            console.log('Servidor en linea', this.port)
      
        })
    }
}

module.exports = Server
