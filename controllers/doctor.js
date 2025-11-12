const mongoose = require('mongoose');
const DoctorModel = require('../models/doctor')
// No se usa bcryptjs aquí, pero se mantiene la línea por si la necesitas para otras funciones
const bcrypt = require('bcryptjs'); 
const {validationResult} = require('express-validator')
const User = require('../models/user'); 

const getAllDoctor= async(req, res) => {
    const allDoctores= await DoctorModel.find()
    res.status(200).json({ msg: 'Se envian todos los doctores', allDoctores})
}

const getOneDoctor= async(req, res) => {
    try {
        const id = req.params.id;
        
        // 1. Ejecutar la búsqueda y el populate (traer el teléfono del usuario)
        const getDoctor = await DoctorModel.findById(id)
            .populate({
                path: 'turnos.usuario', // Navega dentro del array turnos al campo 'usuario'
                select: 'telefono'      // Solo trae el campo 'telefono' del modelo User
            })
            .exec();

        if (!getDoctor) {
            return res.status(404).json({ msg: 'Doctor no encontrado' });
        }
        
        // 2. Mapear los turnos para reestructurar la data que se envía al frontend
        const doctorConTelefonos = getDoctor.toObject();

        doctorConTelefonos.turnos = doctorConTelefonos.turnos.map(turno => ({
            _id: turno._id, // 🛑 CORRECCIÓN: ESENCIAL para que el frontend sepa a qué turno actualizar
            fecha: turno.fecha,
            asistencia: turno.asistencia, // Se mantiene el estado de asistencia
            telefonoUsuario: turno.usuario ? turno.usuario.telefono : null, 
            usuario: turno.usuario ? turno.usuario._id : null // Si necesitas el ID del usuario
        }));

        res.json({ msg: 'Doctor encontrado', getDoctor: doctorConTelefonos });

    } catch (error) {
        console.error("Error al obtener el doctor:", error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
}

const createDoctor = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json({msg: errors.array()})
        }     
        const newDoctor = new DoctorModel(req.body);
        await newDoctor.save()
        res.status(201).json({msg: 'Se agregó nuevo doctor/a'})
    } catch(error){
        console.log(error)
    }
}

const updateDoctor = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updateUser = await DoctorModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'Doctor actualizado', updateUser}) 

    } catch (error) {
        console.log(error)
    }
      
    } 

const deleteDoctor =  async(req, res) => {
    await DoctorModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el doctor'})
}


const agregarTurnoDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { turno, usuarioId } = req.body; 

        // 1. Validar datos
        if (!turno || !usuarioId) {
            return res.status(400).json({ msg: "Debe enviar una fecha de turno y el ID del usuario" });
        }

        // 2. Validación Clave: Asegurar que el ID del usuario es un ObjectId válido.
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ msg: "El ID del paciente proporcionado no es un ID de Mongoose válido." });
        }

        // 3. Buscar el doctor
        const doctor = await DoctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ msg: "Doctor no encontrado" });
        }

        // 4. Agregar turno como un objeto
        doctor.turnos.push({ 
            fecha: new Date(turno),
            usuario: usuarioId // Guardamos la referencia al usuario
            // asistencia: false (se toma del default en el modelo)
        });

        // 5. Guardar 
        await doctor.save();

        res.status(200).json({ msg: "Turno agregado correctamente", doctor });
    } catch (error) {
        console.error("Error detallado al agregar turno:", error); 
        
        if (error.name === 'ValidationError') {
            return res.status(500).json({ msg: "Error de validación al guardar. Revisa el array 'turnos' del doctor en la DB (puede haber entradas corruptas que causan la falla)." });
        }
        
        res.status(500).json({ msg: "Error al agregar turno" });
    }
};

const marcarAsistenciaTurno = async (req, res) => {
    const { id, turnoId } = req.params;
    const { asistencia } = req.body; 

    // *******************************************************
    // ** VALIDACIONES DE ID Y TIPO DE DATO (Correctas) **
    // *******************************************************
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'El ID del doctor es inválido.'
        });
    }
    if (!mongoose.Types.ObjectId.isValid(turnoId)) {
        return res.status(400).json({
            ok: false,
            msg: 'El ID del turno es inválido.'
        });
    }
    if (typeof asistencia !== 'boolean') {
        return res.status(400).json({
            ok: false,
            msg: 'El valor de asistencia es requerido y debe ser booleano (true o false).'
        });
    }
    // *******************************************************

    try {
        // Usa el operador positional $ para actualizar solo el subdocumento que coincide con turnoId
        const doctor = await DoctorModel.findOneAndUpdate( 
            { 
                _id: id,
                'turnos._id': turnoId 
            },
            {
                '$set': { 'turnos.$.asistencia': asistencia }
            },
            { 
                new: true,
                // Solo devuelve el array de turnos para una respuesta más ligera (opcional)
                select: 'turnos' 
            }
        );

        if (!doctor) {
            return res.status(404).json({
                ok: false,
                msg: 'Doctor o Turno no encontrado (Verifique ambos IDs).' 
            });
        }

        res.status(200).json({
            ok: true,
            msg: `Asistencia del turno ${turnoId} actualizada a ${asistencia}.`,
            doctor: doctor 
        });

    } catch (error) {
        console.error("Error detallado en marcarAsistenciaTurno:", error); 
        
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la asistencia del turno (Verifique la conexión a la DB o logs).'
        });
    }
};

// =============================================
// 🔍 Buscar doctor por nombre o apellido
// =============================================
const buscarDoctor = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ msg: 'Debe proporcionar un término de búsqueda.' });
        }

        // Creamos la regex (insensible a mayúsculas)
        const regex = new RegExp(q, 'i');

        // Log para debug
        console.log(`🩺 Buscando doctores con: ${q}`);

        // Buscamos doctores que coincidan por nombre o apellido
        const doctores = await DoctorModel.find({
            $or: [
                { nombre: { $regex: regex } },
                { apellido: { $regex: regex } }
            ]
        }).lean(); // .lean() devuelve objetos JS planos, evita errores con toObject()

        // Si no hay resultados
        if (!doctores || doctores.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron doctores con ese criterio.' });
        }

        res.status(200).json({ msg: 'Doctores encontrados', doctores });

    } catch (error) {
        console.error('❌ Error al buscar doctor:', error.message);
        res.status(500).json({ msg: 'Error interno al buscar doctor.', error: error.message });
    }
};


module.exports ={
    getAllDoctor, 
    getOneDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    agregarTurnoDoctor,
    marcarAsistenciaTurno,
    buscarDoctor
}