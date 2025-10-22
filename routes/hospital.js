const { Router } = require('express');
const { check } = require('express-validator');
const {
  getAllhospital,
  getOnehospital,
  createhospital,
  updatehospital,
  deletehospital,
} = require('../controllers/hospital');

const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth('admin'), getAllhospital);
router.get('/:id', auth('admin'), getOnehospital);

router.post(
  '/',
  [
    check('nombre', 'El campo nombre está vacío').notEmpty(),
    check('nombre', 'El mínimo es de 3 caracteres').isLength({ min: 3 }),
  ],
  auth('admin'),
  createhospital
);

router.put(
  '/:id',
  [check('id', 'El Id no corresponde a un Id de Mongo').isMongoId()],
  auth('admin'),
  updatehospital
);

router.delete('/:id', auth('admin'), deletehospital);

module.exports = router;
