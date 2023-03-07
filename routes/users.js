const express = require('express')
const userrouter = express.Router()  //estamos definiendo un router para configurar rutas
const usertcontroller = require('../Controllers/register')//si pongo solo controllers va a buscar de frente al index, y en nuestro index hemos colocado todos los controllers para la gstión de usuarios
const usertcontrollerget = require('../Controllers/getuserbyid')//si pongo solo controllers va a buscar de frente al index, y en nuestro index hemos colocado todos los controllers para la gstión de usuarios
const usertcontrollerlogin = require('../Controllers/login')//si pongo solo controllers va a buscar de frente al index, y en nuestro index hemos colocado todos los controllers para la gstión de usuarios

userrouter.get('/user/:id',usertcontrollerget.getuserbyid)
userrouter.post('/register',usertcontroller.register)
userrouter.post('/login', usertcontrollerlogin.login)
userrouter.get('/verify/:token', usertcontroller.verify)

module.exports = userrouter