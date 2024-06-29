const estudioMedicoModel = require('../modals/estudioMedico')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

const getAllestudioMedico= async(req, res) => {
    const allestudioMedico= await estudioMedicoModel.find()
    res.status(200).json({ msg: 'Se envian todos los estudioMedicos', allestudioMedico})
    console.log(getAllestudioMedico)
}

const getOneestudioMedico= async(req, res) => {
    const id = req.params.id
    const getestudioMedico = await estudioMedicoModel.findOne({_id: req.params.id})
    res.json({msg: 'estudioMedico encontrado', getestudioMedico})
}

const createestudioMedico = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json({msg: errors.array()})
        }     
        const newestudioMedico = new estudioMedicoModel(req.body);
        await newestudioMedico.save()
        res.status(201).json({msg: 'Se agregó nuevo estudioMedico'})
    } catch(error){
        console.log(error)
    }
}

const updateestudioMedico = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updateestudioMedico = await estudioMedicoModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'estudioMedico actualizado', updateestudioMedico}) 

    } catch (error) {
        console.log(error)
    }
     
    } 

const deleteestudioMedico =  async(req, res) => {
    await estudioMedicoModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el estudioMedico'})
}

/* fin del abm */




module.exports ={
    getAllestudioMedico, 
    getOneestudioMedico,
    createestudioMedico,
    updateestudioMedico,
    deleteestudioMedico,
}