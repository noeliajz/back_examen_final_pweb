const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const {getAllhospital, getOnehospital, createhospital, updatehospital, deletehospital} = require('../controllers/hospital')
const auth = require('../middleware/auth')


router.get('/', auth('admin'), getAllhospital ) 
router.get('/:id', auth('admin'),getOnehospital ) 
 router.post('/',[
    check('nombre', 'El campo nombre  esta vacio').notEmpty(),
    check('nombre', 'El minimo es de 3 caracteres').isLength({min: 3})
 ] , auth('admin'),  createhospital) 

router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], auth('admin') , updatehospital)
router.delete('/:id', auth('admin') , deletehospital )

module.exports = router