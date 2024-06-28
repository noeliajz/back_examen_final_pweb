const jwt = require('jsonwebtoken')
const UserModel = require('../modals/user')

module.exports = (role) => async( req, res, next ) => {
    try {
      const token = req.header('authorization').replace('Bearer ', '')
      console.log(token)
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
      console.log(verifyToken)
      const userLogin = await UserModel.findOne({ _id: verifyToken.usuario.id })
      console.log(userLogin)
      if(userLogin.token && userLogin.role === role){
        req.userLoginId = userLogin._id
        next()
      }else{
        res.status(401).json({msg: 'No autorizado'})
      }

    } catch (error) { 
        console.log(error)
        res.status(500).json({msg: 'Token invalido'})
    }
}