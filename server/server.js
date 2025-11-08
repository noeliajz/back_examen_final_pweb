const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// 🟢 Importar y lanzar la inicialización de WhatsApp
 require('../controllers/whatsappClient');


// Importamos la ruta de WhatsApp
const whatsappRoutes = require('../routes/whatsapp');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 6000;

    // Inicializaciones
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors());
  }

  routes() {
    this.app.use('/api/whatsapp', whatsappRoutes);
    this.app.use('/api/users', require('../routes/user'));
    this.app.use('/api/doctor', require('../routes/doctor'));
    this.app.use('/api/obraSocial', require('../routes/obraSocial'));
    this.app.use('/api/hospital', require('../routes/hospital'));
    this.app.use('/api/estudioMedico', require('../routes/estudioMedico'));
    this.app.use('/api/agenda', require('../routes/agenda'));
    this.app.use('/api/reportes', require('../routes/reportes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('✅ Servidor en línea en el puerto:', this.port);
    });
  }
}

module.exports = Server;
