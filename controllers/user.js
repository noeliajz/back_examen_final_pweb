const UserModel = require('../modals/user')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')

const getAllUser= async(req, res) => {
    const allUsers= await UserModel.find()
    res.status(200).json({ msg: 'Se envian todos los usuarios', allUsers})
}

const getOneUser= async(req, res) => {
    const id = req.params.id
    const getUser = await UserModel.findOne({_id: req.params.id})
    res.json({msg: 'Usuario encontrado', getUser})
}

const createUser = async(req, res) => {
    try {
     const errors = validationResult(req)
     if(!errors.isEmpty()){
         res.status(422).json({msg: errors.array()})
     }     
    const body =req.body
    const userExist = await UserModel.findOne({usuario: body.usuario})
    if(userExist){
       return res.status(400).json({msg: 'El usuario ya existe'})
    }

    const salt = await bcrypt.genSaltSync()
    body.pass = await bcrypt.hash(body.pass, salt)

    const user = new UserModel(body);
     await user.save()
    res.status(201).json({msg: 'Usuario creado con éxito' , user})
   } catch (error) {
    console.log(error)
   }
    }

const updateUser = async(req, res) => {
    try {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()){
       return  res.status(422).json({msg: errors.array()})
    }
    const updateUser = await UserModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'Usuario actualizado', updateUser}) 

    } catch (error) {
        console.log(error)
    }
     
    } 

const deleteUser =  async(req, res) => {
    await UserModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el usuario'})
}

/* fin del abm */


const loginUser = async (req, res) => {
   try {
    const { usuario, pass } = req.body;
    const userExist = await UserModel.findOne({ usuario });
    if(!userExist){
        return res.status(400).json({msg: 'El usuario no existe'})
    }
  const passCheck = await bcrypt.compare(pass, userExist.pass )
  if(passCheck){
     res.status(200).json({msg: 'Usuario logueado'})
  }else{
    res.status(422).json({msg: 'Usuario y/o contraseña incorrecto'})

  }
   } catch (error) {
    console.log(error)
   }
         
        
  };

module.exports ={
    getAllUser, 
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser
}