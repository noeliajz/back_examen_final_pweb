const {Schema, model} = require('mongoose')

const sanatorioSchema = new Schema({
   nombre: {
      type: String,
      require: true
   },
   direccion: String,
   telefono: Number,
   guardia: String,
   notas: String
})

sanatorioSchema.methods.toJSON = function (){
   const { __v, pass, ...sanatorio } = this.toObject()
   return sanatorio
}

const sanatorioModel = model('sanatorio', sanatorioSchema);

module.exports = sanatorioModel