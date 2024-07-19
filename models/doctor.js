const {Schema, model} = require('mongoose')

const DoctorSchema = new Schema({
   
   nombre: {
      type: String,
      require: true
   },  
   apellido: {
      type: String,
      require: true
   },
   notas: String,
   especialidad: {
      type: String,
      require: true
   },
   consultorio: {
      type: String,
      require: true
   },
   usuario: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "El usuario es requerido"],
    },
})


DoctorSchema.methods.toJSON = function (){
   const {__v, ...doctor } = this.toObject()
   return doctor
}

const DoctorModel = model('doctores', DoctorSchema);

module.exports = DoctorModel