const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const {getAllhospital, getOnehospital, createhospital, updatehospital, deletehospital} = require('../controllers/hospital')
const auth = require('../middleware/auth')


router.get('/', getAllhospital ) 
router.get('/:id', getOnehospital ) 
 router.post('/',[
    check('nombre', 'El campo nombre  esta vacio').notEmpty(),
    check('nombre', 'El minimo es de 3 caracteres').isLength({min: 3}),
    

 ] , createhospital) 

router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updatehospital)
router.delete('/:id', deletehospital )

module.exports = router