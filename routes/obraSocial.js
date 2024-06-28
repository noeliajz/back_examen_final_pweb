const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const {getAllobraSocial, getOneobraSocial, createobraSocial, updateobraSocial, deleteobraSocial} = require('../controllers/obraSocial')
const auth = require('../middleware/auth')


router.get('/', getAllobraSocial ) 
router.get('/:id', getOneobraSocial ) 
 router.post('/',[
    check('nombre', 'El nombre usuario esta vacio').notEmpty(),
    check('nombre', 'El minimo es de 3 caracteres').isLength({min: 3}),
    

 ] , createobraSocial) 

router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updateobraSocial)
router.delete('/:id', deleteobraSocial )

module.exports = router