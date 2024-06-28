const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const {getAllsanatorio, getOnesanatorio, createsanatorio, updatesanatorio, deletesanatorio} = require('../controllers/sanatorio')
const auth = require('../middleware/auth')


router.get('/', getAllsanatorio ) 
router.get('/:id', getOnesanatorio ) 
 router.post('/',[
    check('nombre', 'El campo nombre  esta vacio').notEmpty(),
    check('nombre', 'El minimo es de 3 caracteres').isLength({min: 3}),
    

 ] , createsanatorio) 

router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updatesanatorio)
router.delete('/:id', deletesanatorio )

module.exports = router