const {Schema, model} = require('mongoose')

const hospitalSchema = new Schema({
   nombre: {
      type: String,
      require: true
   },
   direccion: String,
   telefono: Number,
   guardia: String,
   notas: String
})

hospitalSchema.methods.toJSON = function (){
   const { __v, pass, ...hospital } = this.toObject()
   return hospital
}

const hospitalModel = model('hospital', hospitalSchema);

module.exports = hospitalModel