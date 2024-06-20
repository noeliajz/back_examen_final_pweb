const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const {getAllUser, getOneUser, createUser, updateUser, deleteUser, loginUser} = require('../controllers/user')

router.get('/', getAllUser ) 
router.get('/:id', getOneUser ) 
router.post('/',[
    check('usuario', 'El campo usuario esta vacio').notEmpty(),
    check('usuario', 'El minimo es de 3 caracteres').isLength({min: 3}),
    check('pass', 'El campo contraseña esta vacio').notEmpty(),
    check('pass', 'El minimo es de 4 caracteres').isLength({min: 4}),
    check('ObraSocial', 'El  minimo es de 4 caracteres').isLength({min: 4})
] , createUser)
router.post('/login', [
    check('usuario', 'El campo USUARIO esta vacío').notEmpty(),
    check('usuario', 'El mínimo es de 3 caracteres').isLength({ min:3 }),
    check('usuario', 'El campo USUARIO debe ser del tipo MAIL').isEmail(),
    check('pass', 'El campo contraseña esta vacío').notEmpty(),
    check('pass', 'El mínimo es de 4 caracteres').isLength({ min:4 })
], loginUser)
router.put('/:id',[
    check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()
], updateUser)
router.delete('/:id', deleteUser )

module.exports = router