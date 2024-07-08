const AgendaModel = require("../models/agenda")
const DoctorModel = require("../models/doctor")

const getOneAgendaAllDoctor = async (req, res) => {
    try {
        const getAgenda = await AgendaModel.findOne({_id: req.params.id})
        res.status(200).json({msg: 'Agenda encontrada', getAgenda})
    } catch (error) {
        console.log(error)
    }
}

const addDoctorAgenda = async (req, res) => {
    try {
      console.log(req.params.idAgenda)
       const getAgenda = await AgendaModel.findOne({_id: req.params.idAgenda}) 
       const getDoc = await DoctorModel.findOne({_id: req.params.idDoc})
       console.log(getAgenda)

      const docExist = getAgenda.doctors.filter((doc) => doc._id == req.params.idDoc)
      if(docExist.length > 0){
        return res.status(400).json({msg: 'Doctor duplicado en su carrito', status: 400})
      }

       getAgenda.doctors.push(getDoc) 
       await getAgenda.save() 
                                   
       res.status(200).json({msg: 'El doctor se cargo en la agenda correctamente', getAgenda})
      } catch (error) {
      console.log(error)
    }
  }

  const createAgenda = async (req, res) => {
    try {
        const newAgenda = new AgendaModel(req.body)
        await newAgenda.save()
        res.status(200).json({msg: 'Agenda creada', newAgenda})
    } catch (error) {
        console.log(error)
    }
  }




module.exports = {
    getOneAgendaAllDoctor,
    addDoctorAgenda,
    createAgenda
    
}
