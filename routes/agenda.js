const { Router } = require('express')
const { getOneAgendaAllDoctor, addDoctorAgenda, createAgenda} = require('../controllers/agenda')
const router = Router()
const auth = require('../middleware/auth')

router.get('/:id',  getOneAgendaAllDoctor)
router.post('/:idAgenda/:idDoc', addDoctorAgenda)
router.post('/',  createAgenda)

module.exports = router