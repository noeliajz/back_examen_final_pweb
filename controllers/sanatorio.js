const sanatorioModel = require('../modals/sanatorio')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

const getAllsanatorio= async(req, res) => {
    const allsanatorio= await sanatorioModel.find()
    res.status(200).json({ msg: 'Se envian todos los sanatorios', allsanatorio})
    console.log(getAllsanatorio)
}

const getOnesanatorio= async(req, res) => {
    const id = req.params.id
    const getsanatorio = await sanatorioModel.findOne({_id: req.params.id})
    res.json({msg: 'Sanatorio encontrado', getsanatorio})
}

const createsanatorio = async(req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
           return res.status(422).json({msg: errors.array()})
        }     
        const newsanatorio = new sanatorioModel(req.body);
        await newsanatorio.save()
        res.status(201).json({msg: 'Se agregó nuevo sanatorio'})
    } catch(error){
        console.log(error)
    }
}

const updatesanatorio = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updatesanatorio = await sanatorioModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'sanatorio actualizado', updatesanatorio}) 

    } catch (error) {
        console.log(error)
    }
     
    } 

const deletesanatorio =  async(req, res) => {
    await sanatorioModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el sanatorio'})
}

/* fin del abm */




module.exports ={
    getAllsanatorio, 
    getOnesanatorio,
    createsanatorio,
    updatesanatorio,
    deletesanatorio,
}