const hospitalModel = require('../models/hospital');
const { validationResult } = require('express-validator');

/* =====================
   OBTENER TODOS LOS HOSPITALES
===================== */
const getAllhospital = async (req, res) => {
  try {
    const allhospital = await hospitalModel.find();
    console.log(allhospital); // ✅ para ver si trae datos
    res.status(200).json({ msg: 'Se envían todos los hospitales', allhospital });
  } catch (error) {
    console.error('Error al obtener hospitales:', error);
    res.status(500).json({ msg: 'Error al obtener hospitales' });
  }
};

/* =====================
   OBTENER UN HOSPITAL POR ID
===================== */
const getOnehospital = async (req, res) => {
  try {
    const gethospital = await hospitalModel.findById(req.params.id);
    if (!gethospital) {
      return res.status(404).json({ msg: 'Hospital no encontrado' });
    }
    res.json({ msg: 'Hospital encontrado', gethospital });
  } catch (error) {
    console.error('Error al obtener hospital:', error);
    res.status(500).json({ msg: 'Error al obtener hospital' });
  }
};

/* =====================
   CREAR HOSPITAL
===================== */
const createhospital = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ msg: errors.array() });
    }

    console.log(req.body); // ✅ para verificar datos que llegan del frontend

    const newhospital = new hospitalModel(req.body);
    await newhospital.save();

    res.status(201).json({ msg: 'Se agregó nuevo hospital' });
  } catch (error) {
    console.error('Error al crear hospital:', error);
    res.status(500).json({ msg: 'Error al crear hospital' });
  }
};

/* =====================
   ACTUALIZAR HOSPITAL
===================== */
const updatehospital = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ msg: errors.array() });
    }

    const updatehospital = await hospitalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ msg: 'Hospital actualizado', updatehospital });
  } catch (error) {
    console.error('Error al actualizar hospital:', error);
    res.status(500).json({ msg: 'Error al actualizar hospital' });
  }
};

/* =====================
   ELIMINAR HOSPITAL
===================== */
const deletehospital = async (req, res) => {
  try {
    await hospitalModel.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Se eliminó correctamente el hospital' });
  } catch (error) {
    console.error('Error al eliminar hospital:', error);
    res.status(500).json({ msg: 'Error al eliminar hospital' });
  }
};

module.exports = {
  getAllhospital,
  getOnehospital,
  createhospital,
  updatehospital,
  deletehospital,
};
