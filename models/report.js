const mongoose = require('mongoose')

const reportschema = mongoose.Schema({
    lugar: String,
    area: String,
    descripcionlugar:String,
    unidadminera: String,
    fecha: String,
    hora: String,
    tipoaccidente: String,
    empresa: String,
    gerencia: String,
    lesiones: String,
    danhos: String,
    consrealpersonal: String,
    consrealpatrimonial: String,
    conspotencialpersonal: String,
    conspotencialpatrimonial: String,
    descripcion: String,
    imagebefore: String,
    imageafter: String,
    acciones: String,
    elaboradopor: String,
    imagebefore:{
        data: Buffer,
        contentType:String
                },
    imageafter:{
        data: Buffer,
        contentType:String
                },            
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const report = mongoose.model('report',reportschema)
module.exports = report