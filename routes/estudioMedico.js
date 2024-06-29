const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const {getAllestudioMedico, getOneestudioMedico, createestudioMedico, updateestudioMedico, deleteestudioMedico} = require('../controllers/estudioMedico.js')
const auth = require('../middleware/auth')


router.get('/', getAllestudioMedico ) 
router.get('/:id', getOneestudioMedico ) 
 router.post('/',[
    check('numeroEstudio', 'El campo numero de estudio  esta vacio').notEmpty(),
    check('numeroEstudio', 'El minimo es de 3 caracteres').isLength({min: 3}),
    check('paginaWeb', 'El campo pagina web  esta vacio').notEmpty()
 ] , createestudioMedico) 

router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updateestudioMedico)
router.delete('/:id', deleteestudioMedico )

module.exports = router