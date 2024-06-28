const {Schema, model} = require('mongoose')

const obraSocialSchema = new Schema({
   nombre: {
      type: String,
      require: true
   }
})

obraSocialSchema.methods.toJSON = function (){
   const { __v, pass, ...obraSocial } = this.toObject()
   return obraSocial
}

const obraSocialModel = model('obraSocial', obraSocialSchema);

module.exports = obraSocialModel