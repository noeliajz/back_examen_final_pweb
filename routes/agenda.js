const { Router } = require('express')
const { getOneAgendaAllDoctor, addEstudioMedicoAgenda, createAgenda} = require('../controllers/agenda')
const router = Router()
const auth = require('../middleware/auth')

router.get('/:id', auth('user') , getOneAgendaAllDoctor)
router.post('/:idAgenda/:idDoc', auth('user'), addEstudioMedicoAgenda)
router.post('/:idAgenda/:idEst', auth('user'),addEstudioMedicoAgenda)
router.post('/',  createAgenda)

module.exports = router