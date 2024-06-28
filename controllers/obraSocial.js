const obraSocialModel = require('../modals/obraSocial')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

const getAllobraSocial= async(req, res) => {
    const allobraSocial= await obraSocialModel.find()
    res.status(200).json({ msg: 'Se envian todos las obras sociales', allobraSocial})
}

const getOneobraSocial= async(req, res) => {
    const id = req.params.id
    const getobraSocial = await obraSocialModel.findOne({_id: req.params.id})
    res.json({msg: 'Obra social encontrada', getobraSocial})
}

const createobraSocial = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json({msg: errors.array()})
        }     
        const newobraSocial = new obraSocialModel(req.body);
        await newobraSocial.save()
        res.status(201).json({msg: 'Se agregó nueva obra social'})
    } catch(error){
        console.log(error)
    }
}

const updateobraSocial = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updateobraSocial = await obraSocialModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'Obra social actualizada', updateobraSocial}) 

    } catch (error) {
        console.log(error)
    }
     
    } 

const deleteobraSocial =  async(req, res) => {
    await obraSocialModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente la obra social'})
}

/* fin del abm */




module.exports ={
    getAllobraSocial, 
    getOneobraSocial,
    createobraSocial,
    updateobraSocial,
    deleteobraSocial,
}