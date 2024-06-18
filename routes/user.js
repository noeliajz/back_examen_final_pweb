const {Router} = require('express')
const router = Router()
const {getAllUser, getOneUser, createUser, updateUser, deleteUser} = require('../controllers/user')

router.get('/', getAllUser ) 
router.get('/:id', getOneUser ) 

router.post('/', createUser)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser )

module.exports = router