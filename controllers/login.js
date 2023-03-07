const bcrypt = require('bcrypt');//para encriptar la contraseña
const users = require('../models/users')
const jwt = require('jsonwebtoken')
const cookie = require('cookie');


const login = async (req, res) =>{
    console.log("Petición de verificación de usuario")

    const {DNI, contrasena} = req.body

    console.log(req.body.DNI);
    console.log(req.body.contrasena);

    users.findOne({DNI})
    .then((users)=>{
        if(!users){
            console.log("usuario no encontrado")
            return res.json({message:"Usuario no encontrados", guia:1}); 
        }
        

            bcrypt.compare(contrasena, users.contrasena)
            .then((rescomparacion)=>{
                if(rescomparacion===true){


                    //Generción de token
                    const token = jwt.sign({
                        DNI,
                        contrasena,
                      }, process.env.JWT_LOGIN);


                    const cookieObj = {
                        httpOnly: true,
                        expires: new Date(Date.now() + 9000000), // 15 minutos
                        path: '/',
                        secure: false,
                        maxAge: 9000000, // 15 minutos en segundos
                        name: 'ElRealToken',
                        value: token,
                        domain: 'localhost'
                      };


                    const cookieString = cookie.serialize(cookieObj.name,cookieObj.value,{
                        httpOnly: true,
                        maxAge: 3600
                    })
                    res.setHeader('Set-Cookie',cookieString)
                    res.cookie('token',token,{ httpOnly: true, maxAge: 86400000 })
                    console.log(cookieString);
                    console.log(token);


                    console.log("inicio de sesión exitoso")
                    return res.json({message:"inicio de sesión exitoso", guia:2, SetCookie: {cookieString}})

                                        
                }else{
                    console.log("contraseña incorrecta")
                    return res.json({message:"contraseña incorrecta", guia:3})
                }
            })
        
    })
}

module.exports = {login}