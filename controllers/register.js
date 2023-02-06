const bcrypt = require('bcrypt');//para encriptar la contraseña
const e = require('express');
const users = require('../models/users')


const register = async (req, res) =>{
    console.log("Petición recibida")
    console.log(req.body)

    const {nombre, DNI, contrasena, empresa, correo} = req.body;


    await users.findOne({DNI})//esto es para buscar si ya existe un dato (DNI) ya creado en la base de datos
    .then((DNInuevo)=>{
        if(DNInuevo){
            return res.json({message: "ya existe un DNI con ese nombre", existe:"Si"}),
            console.log("ya existe un DNI con ese nombre")
        }else if (!DNI || !nombre || !empresa || !correo || !contrasena){
            return res.json({message: "debe llenar todos los campos",textsenha:contrasena, textname:nombre, textuser:DNI})
        } else {
            bcrypt.hash(contrasena,10,
                (error, contrasenaencriptada)=>{
                    if(error) res.json({error})
                    else{
                        const nuevousuario = new users({
                            nombre: nombre,
                            DNI: DNI,
                            correo: correo,
                            empresa: empresa,
                            contrasena: contrasenaencriptada
                        })

                        nuevousuario.save()
                        .then((usuarionuevo)=>{
                            res.json({message:`Usuario ${DNI} creado`})  
                            console.log(`Usuario ${DNI} creado`)
                        })
                        .catch((error) => console.log(error))

                    }
                }
                )
        }
    })
}



module.exports = {register}