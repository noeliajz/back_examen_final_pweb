const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

const {getAllDoctor, getOneDoctor, createDoctor, updateDoctor, deleteDoctor} = require('../controllers/doctor')

router.get('/', getAllDoctor ) 
router.get('/:id', getOneDoctor ) 
router.post('/',[
     check('nombre', 'El campo nombre esta vacio').notEmpty(),
    check('nombre', 'El minimo es de 3 caracteres').isLength({min: 3}),
    check('apellido', 'El campo apellido esta vacio').notEmpty(),
    check('apellido', 'El minimo es de 4 caracteres').isLength({min: 4}), 
    check('notas', 'El mínimo es de 4 caracteres').isLength({ min:4 }),
    check('especialidad', 'El campo especialidad esta vacio').notEmpty(),
    check('especialidad', 'El mínimo es de 4 caracteres').isLength({ min:4 }),
    check('especialidad', 'El campo especialidad esta vacio').notEmpty(),
    check('consultorio', 'El campo consultorio esta vacio').notEmpty(),
    check('consultorio', 'El mínimo es de 4 caracteres').isLength({ min:4 })
 ], createDoctor)

router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updateDoctor)
router.delete('/:id', deleteDoctor )

module.exports = router