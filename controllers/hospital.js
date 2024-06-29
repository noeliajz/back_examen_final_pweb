const hospitalModel = require('../modals/hospital')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

const getAllhospital= async(req, res) => {
    const allhospital= await hospitalModel.find()
    res.status(200).json({ msg: 'Se envian todos los hospitals', allhospital})
    console.log(getAllhospital)
}

const getOnehospital= async(req, res) => {
    const id = req.params.id
    const gethospital = await hospitalModel.findOne({_id: req.params.id})
    res.json({msg: 'hospital encontrado', gethospital})
}

const createhospital = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json({msg: errors.array()})
        }     
        const newhospital = new hospitalModel(req.body);
        await newhospital.save()
        res.status(201).json({msg: 'Se agregó nuevo hospital'})
    } catch(error){
        console.log(error)
    }
}

const updatehospital = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updatehospital = await hospitalModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'hospital actualizado', updatehospital}) 

    } catch (error) {
        console.log(error)
    }
     
    } 

const deletehospital =  async(req, res) => {
    await hospitalModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el hospital'})
}

/* fin del abm */




module.exports ={
    getAllhospital, 
    getOnehospital,
    createhospital,
    updatehospital,
    deletehospital,
}