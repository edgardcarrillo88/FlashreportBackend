const bcrypt = require('bcrypt');//para encriptar la contraseña
const express = require('express');
const users = require('../models/users')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const open = require('open')
const cookie = require('cookie');



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
                        .then( async (usuarionuevo)=>{

                            

                            //Generción de token
                            const token = jwt.sign({
                                DNI,
                                correo,
                              }, process.env.JWT_SECRET, { expiresIn: '1h' });




                            // Envío de correo electrónico de verificación
                            const transporter = nodemailer.createTransport({
                                host: 'smtp-mail.outlook.com',
                                port: 587,
                                secure: false,
                                auth: {
                                user: 'edgard.carrillo@minsur.com',
                                pass: process.env.PASSWORDMAIL,
                                },
                            });
            
                            const mailOptions = {
                                from: 'edgard.carrillo@minsur.com',
                                to: correo,
                                subject: 'Verificación de correo electrónico - Registro Flahsreport',
                                html: `Por favor verifica tu cuenta haciendo clic en el siguiente enlace: 
                                <a href="http://localhost:5000/api/v1/users/verify/${token}">Verificar cuenta</a>`,
                            };//localhost:3000/verify
            
                            await transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                console.log(error);
                                } else {
                                console.log(`Email enviado: ${info.response}`);
                                }
                            });




                            

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



const verify = async (req, res) => {
    // const { token } = req.body;
    const token  = req.params.token;
    console.log("iniciando proceso");
    console.log(token);
    console.log(req.params.token);
    // console.log(jwt.verify(token, process.env.JWT_SECRET));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    //   const usuario = await users.findById(decoded.id);
      const usuario = await users.findOne({DNI: decoded.DNI});
      console.log(usuario);
      if (!usuario) return res.json({ message: 'Usuario no encontrado' });
  
      usuario.verificado = true;
      console.log("usuario verificado");

      open('http://localhost:3000/login')
      .then(() => {
          console.log('Enlace abierto con éxito');
      })
      .catch((error) => {
          console.error(`Error al abrir el enlace: ${error.message}`);
      });
      


      await usuario.save();

      return res.json({ message: 'Usuario verificado exitosamente', ok:true });
      
   
    



    } catch (error) {
      return res.json({ message: 'Token inválido', aaa:{token} });
    }
  };

module.exports = {register, verify}