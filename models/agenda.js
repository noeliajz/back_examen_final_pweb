const { Schema, model} = require('mongoose')

const AgendaSchema = new Schema({
    idUsuario: {
        type: String
    },
    doctors: [],
    estudioMedico: []
})

AgendaSchema.methods.toJSON = function(){
    /* spread operator */
    const { __v, ...agenda } = this.toObject()
    return agenda
}

const AgendaModel = model('agenda', AgendaSchema)
module.exports = AgendaModel