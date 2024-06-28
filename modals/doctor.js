const {Schema, model} = require('mongoose')

const DoctorSchema = new Schema({
   nombre: String,
   nombre: {
      type: String,
      unique: true,
      require: true
   },
   apellido: String,
   apellido: {
      type: String,
      unique: true,
      require: true
   },
   notas: String,
   especialidad: String,
   especialidad: {
      type: String,
      require: true
   },
   consultorio: String,
   consultorio: {
      type: String,
      require: true
   },
})

DoctorSchema.methods.toJSON = function (){
   const {__v, ...doctor } = this.toObject()
   return doctor
}

const DoctorModel = model('doctores', DoctorSchema);

module.exports = DoctorModel