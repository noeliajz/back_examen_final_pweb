const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const { sendMailReminder } = require('../helpers/mail');

const { 
    getAllDoctor, 
    getOneDoctor, 
    createDoctor, 
    updateDoctor, 
    deleteDoctor, 
    agregarTurnoDoctor,
    // Se agrega el nuevo controlador para la asistencia
    marcarAsistenciaTurno 
} = require('../controllers/doctor');

// Rutas GET
router.get('/', getAllDoctor ) 
router.get('/:id', getOneDoctor ) 

// Ruta POST para crear doctor (con validaciones)
router.post('/',[
    check('nombre', 'El campo nombre esta vacio').notEmpty(),
    check('nombre', 'El minimo es de 3 caracteres').isLength({min: 3}),
    check('apellido', 'El campo apellido esta vacio').notEmpty(),
    check('apellido', 'El minimo es de 4 caracteres').isLength({min: 4}), 
    check('notas', 'El mínimo es de 4 caracteres').isLength({ min:4 }),
    check('especialidad', 'El campo especialidad esta vacio').notEmpty(),
    check('especialidad', 'El mínimo es de 4 caracteres').isLength({ min:4 }),
    check('consultorio', 'El campo consultorio esta vacio').notEmpty(),
    check('consultorio', 'El mínimo es de 4 caracteres').isLength({ min:4 })
], createDoctor)

// Ruta PUT para actualizar doctor (con validaciones de ID)
router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updateDoctor)

// Ruta DELETE
router.delete('/:id', deleteDoctor )

// Rutas de Turnos
// Ruta POST para agregar un nuevo turno
router.post('/:id/turnos', agregarTurnoDoctor)

// 🩺 NUEVA RUTA: Marcar/Actualizar Asistencia de un Turno
// :id es el ID del doctor, y :turnoId es el ID del subdocumento del turno
router.put('/:id/turnos/:turnoId/asistencia', marcarAsistenciaTurno)

// Ruta POST para envío de recordatorio por email
router.post('/send-reminder', async (req, res) => {
    try {
        const { to, doctorName, doctorSpecialty, turns } = req.body;
        
        await sendMailReminder({ to, doctorName, doctorSpecialty, turns });

        res.status(200).json({ success: true, message: 'Recordatorio enviado con éxito.' });
    } catch (error) {
        console.error('Error en la ruta de recordatorio:', error);
        res.status(500).json({ success: false, message: 'Fallo el envío del recordatorio.' });
    }
});

module.exports = router