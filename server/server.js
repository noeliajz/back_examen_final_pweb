const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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
        this.app.use(cors())
      
    }

    routes(){
       
       this.app.use('/api/users', require('../routes/user')),
       this.app.use('/api/doctor', require('../routes/doctor'))
       this.app.use('/api/obraSocial', require('../routes/obraSocial'))
       this.app.use('/api/sanatorio', require('../routes/sanatorio'))
       this.app.use('/api/hospital', require('../routes/hospital'))
       this.app.use('/api/estudioMedico', require('../routes/estudioMedico'))
       this.app.use('/api/agenda', require('../routes/agenda'))

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
