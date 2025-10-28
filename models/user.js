const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
   usuario: {
      type: String,
      unique: true,
      require: true
   },
   pass: {
      type: String,
      require: true
   },
   obraSocial: String,
   token: {
      type: String,
      default: ''
    },
   role: {
      type: String,
      default: 'user'
   },
   idAgenda: {
      type: String
    },
    telefono: {
      type: Number
    }
  
})



UserSchema.methods.toJSON = function (){
   const { __v, pass, ...usuario } = this.toObject()
   return usuario
}

const userModel = model('users', UserSchema);

module.exports = userModel