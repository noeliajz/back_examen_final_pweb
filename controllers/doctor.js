const DoctorModel = require('../models/doctor')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

const getAllDoctor= async(req, res) => {
    const allDoctores= await DoctorModel.find()
    res.status(200).json({ msg: 'Se envian todos los doctores', allDoctores})
}

const getOneDoctor= async(req, res) => {
    const id = req.params.id
    const getDoctor = await DoctorModel.findOne({_id: req.params.id})
    res.json({msg: 'Doctor encontrado', getDoctor})
}

const createDoctor = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json({msg: errors.array()})
        }     
        const newDoctor = new DoctorModel(req.body);
        await newDoctor.save()
        res.status(201).json({msg: 'Se agregó nuevo doctor/a'})
    } catch(error){
        console.log(error)
    }
}

const updateDoctor = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updateUser = await DoctorModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'Doctor actualizado', updateUser}) 

    } catch (error) {
        console.log(error)
    }
     
    } 

const deleteDoctor =  async(req, res) => {
    await DoctorModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el doctor'})
}

/* fin del abm */

const agregarTurnoDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { turno } = req.body; // espera una fecha (ej: "2025-11-05T10:00:00Z")

    // validar que haya un turno
    if (!turno) {
      return res.status(400).json({ msg: "Debe enviar una fecha de turno" });
    }

    // buscar el doctor
    const doctor = await DoctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor no encontrado" });
    }

    // agregar turno
    doctor.turnos.push(new Date(turno));

    // guardar
    await doctor.save();

    res.status(200).json({ msg: "Turno agregado correctamente", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agregar turno" });
  }
};



module.exports ={
    getAllDoctor, 
    getOneDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    agregarTurnoDoctor
}