const UserModel = require('../models/user')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const AgendaModel = require("../models/agenda")
const transporter = require("../middleware/nodemailer")

const getAllUser= async(req, res) => {
    const allUsers= await UserModel.find()
    res.status(200).json({ msg: 'Se envian todos los usuarios', allUsers})
}

const getOneUser= async(req, res) => {
    const id = req.params.id
    const getUser = await UserModel.findOne({_id: req.params.id})
    res.json({msg: 'Usuario encontrado', getUser})
}

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ msg: errors.array() });
    }
    const body = req.body;
    if (!body.usuario) {
      return res.status(400).json({ msg: 'El campo usuario es requerido' });
    }
    const userExist = await UserModel.findOne({ usuario: body.usuario });
    if (userExist) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    const salt = await bcrypt.genSaltSync();
    body.pass = await bcrypt.hash(body.pass, salt);
    const user = new UserModel(body);
    const agenda = new AgendaModel();
    agenda.idUsuario = user._id;
    user.idAgenda = agenda._id; 
    await user.save();
    await agenda.save();

    await transporter.sendMail({
      from: '"Bienvenido a Salud Organizada" <noeliajudithzelaya@gmail.com>',
      to: "noeliajudithzelaya@gmail.com",
      subject: "¡Bienvenido!",
      html: "<b>Gracias por registrarte</b>",
    });
    res.status(201).json({ msg: 'Usuario creado con éxito', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error interno del servidor', error: error.message });
  }
};



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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ msg: errors.array() });
    }

    const { usuario, pass } = req.body;
    console.log(req.body)
    const userExist = await UserModel.findOne({ usuario });
    console.log(userExist)
    if (!userExist) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    const passCheck = await bcrypt.compare(pass, userExist.pass);

    if (passCheck) {
      const jwtPayload = {
        usuario: {
          id: userExist._id,
          username: userExist.usuario,
        },
      };
      console.log(userExist);
      const token = jwt.sign(jwtPayload, process.env.SECRET_key);
      userExist.token = token;
        userExist.save()
       res.status(200).json({ msg: "Usuario logueado" , userExist});
    
   
      } else {
      res.status(422).json({ msg: "Usuario y/o contraseña incorrecto" });
    }
  } catch (error) {
    console.log(error);
  } 
    
    
  };

  const logoutUser = async (req, res) => {
     const userId = await UserModel.findOne({ _id: req.body.userLoginId });
    console.log(userId);
    userId.token = "";
    const userLogout = await UserModel.findByIdAndUpdate(
      { _id: req.body.userLoginId },
      userId,
      { new: true } 
     );

    console.log(userLogout);
    res.status(200).json({ msg: "Usuario deslogueado" }); 
  };

module.exports ={
    getAllUser, 
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser
}