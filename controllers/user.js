const users = []
const UserModel = require('../modals/user')

const getAllUser= async(req, res) => {
    const allUsers= await UserModel.find()
    res.status(200).json({ msg: 'Se envian todos los usuarios', allUsers})
}

const getOneUser= async(req, res) => {
    const id = req.params.id
    const getUser = await UserModel.findOne({_id: id})
    res.json({msg: 'Usuario encontrado', getUser})
}

const createUser = async(req, res) => {
   try {
    const body =req.body
    const userExist = await UserModel.findOne({usuario: body.usuario})
    if(userExist){
       return res.status(400).json({msg: 'El usuario ya existe', user})
    }
    const user = new UserModel(body);
     await user.save()
    res.status(201).json({msg: 'Usuario creado con éxito'})
   } catch (error) {
    console.log(error)
   }
/*     users.push(body)
       console.log(users)
       res.json({msg: 'Registro exitoso'}) 
*/    

    }

const updateUser = async(req, res) => {
      const updateUser = await UserModel.findByIdAndUpdate({_id:req.params.id}, req.body, {new: true})
      res.json({msg: 'Usuario actualizado', updateUser})
    } 

const deleteUser =  async(req, res) => {
    await UserModel.findByIdAndDelete({_id: req.params.id })
    res.json({msg: 'se eliminó correctamente el usuario'})
}

module.exports ={
    getAllUser, 
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}