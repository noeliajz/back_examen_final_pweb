const { Router } = require('express')
const { getOneAgendaAllDoctor, addEstudioMedicoAgenda, createAgenda} = require('../controllers/agenda')
const router = Router()
const auth = require('../middleware/auth')

router.get('/:id',  getOneAgendaAllDoctor)
router.post('/:idAgenda/:idDoc', addEstudioMedicoAgenda)
router.post('/:idAgenda/:idEst', addEstudioMedicoAgenda)
router.post('/',  createAgenda)

module.exports = router