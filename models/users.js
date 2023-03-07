const mongoose = require('mongoose')

//DEFINIR EL ESQUEMA DE LOS DATOS QUE SE ESTAN ENVIANDO AL SERVIDOR

const usersquema = mongoose.Schema(
    {
        nombre:{type:String},
        correo:{type:String},
        usuario:{type:String},
        DNI:{type:String},
        contrasena:{type:String},
        empresa:{type:String},
        deleted: {type: Boolean, default:false},
        verificado: { type: Boolean, default: false }
    },{
        timestamps:true
    })

//MODELO
const users = mongoose.model('users',usersquema)

module.exports = users//esto es importante ya que lo que va a hacer es darle la caracteristica a "dbconnect" para que se pueda exportar 