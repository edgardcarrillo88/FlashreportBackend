const users = require('../models/users')

const getuserbyid = async (req, res) =>{
    console.log("petición de inicio de sesión recibida");
    const {id}= req.params
    
    if(id.length ===24){
        users.findById(id)
        .then((users)=>{
            if(!users){
                return res.json({message:"Usuario no encontrado"})
            }else{
                const {_id, contrasena,__v,...resto} = users._doc;
                res.json(resto)
                console.log(resto)
                console.log("inicio de sesión exitosa")
            }
        })
    }else{
        res.json({message:"contraseña incorrecta"})
    }
   }


module.exports = {getuserbyid}  