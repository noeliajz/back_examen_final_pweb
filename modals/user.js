const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
   usuario: String,
   usuario: {
      type: String,
      unique: true,
      require: true
   },
   pass: String,
   pass: {
      type: String,
      unique: true,
      require: true
   },
   obraSocial: String
})

const userModel = mongoose.model('users', UserSchema);

module.exports = userModel