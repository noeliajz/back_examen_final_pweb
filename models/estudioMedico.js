const {Schema, model} = require('mongoose')

const estudioMedicoSchema = new Schema({
   numeroEstudio: Number,
   paginaWeb: String
})

estudioMedicoSchema.methods.toJSON = function (){
   const { __v, pass, ...estudioMedico } = this.toObject()
   return estudioMedico
}

const estudioMedicoModel = model('estudioMedico', estudioMedicoSchema);

module.exports = estudioMedicoModel