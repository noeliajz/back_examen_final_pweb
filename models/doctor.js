const {Schema, model} = require('mongoose')

// Asumimos que el modelo User ya está definido y se llama 'users'.

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
    // ******************************************************
    // ** CAMBIO CLAVE: Turnos ahora es un objeto **
    // ******************************************************
    turnos: [{
        fecha: {
            type: Date,
            required: true
        },
        // Referencia al modelo User (asumimos que el collection se llama 'users')
        usuario: { 
            type: Schema.Types.ObjectId,
            ref: 'users', // Debe coincidir con el nombre de la colección del usuario
            required: true
        },
        // ******************************************************
        // ** NUEVO CAMPO: asistencia (para registrar si el paciente asistió) **
        // ******************************************************
        asistencia: {
            type: Boolean,
            default: false // Por defecto, se asume que no ha asistido hasta que se marque.
        }
    }]
    // ******************************************************
})


DoctorSchema.methods.toJSON = function (){
    const {__v, ...doctor } = this.toObject()
    return doctor
}

const DoctorModel = model('doctores', DoctorSchema);

module.exports = DoctorModel