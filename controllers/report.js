const report = require('../models/report')
const fs = require('fs')
const upload =  require('../middleware/upload')
const path = require('path')
const PDFDocument = require('pdfkit')
const { now } = require('mongoose')
const nodemailer = require('nodemailer')



//Obtener datos
const getreport =  async (req,res)=>{
    //const {id} = req.params
    // const reports = await report.findById(id)
    // const reports1 = await report.findByIdAndUpdate(id)
    const reports = await report.find({deleted:false}).sort({_id:'desc'})
    res.status(200).json({ok: true, data:reports})
    }



//Crear datos
const createreport = (req,res,next)=>{
    console.log("Petición recibida")

    const obj = JSON.parse(req.body.reporte);
    console.log(obj.unidadminera);
    
    
    const flashreport = new report({
        lugar: obj.lugar,
        area: obj.area,
        descripcionlugar:obj.descripcionlugar,
        unidadminera: obj.unidadminera,
        fecha: obj.fecha,
        hora: obj.hora,
        tipoaccidente: obj.tipoaccidente,
        empresa: obj.empresa,
        gerencia: obj.gerencia,
        lesiones: obj.lesiones,
        danhos: obj.danhos,
        consrealpersonal: obj.consrealpersonal,
        consrealpatrimonial: obj.consrealpatrimonial,
        conspotencialpersonal: obj.conspotencialpersonal,
        conspotencialpatrimonial: obj.conspotencialpatrimonial,
        descripcion: obj.descripcion,
        acciones: obj.acciones,
        elaboradopor: obj.elaboradopor,

        // imagebefore:{
        //     data: fs.readFileSync('uploads/' + req.file.filename),
        //     contentType: "image/png",
        // },

        imagebefore:{
            data: fs.readFileSync(req.files.imagebefore[0].path),
            contentType: req.files.imagebefore[0].mimetype,
        },

        imageafter:{
            data: fs.readFileSync(req.files.imageafter[0].path),
            contentType: req.files.imageafter[0].mimetype,
        },
    })


    flashreport.save()
    .then((reuslt)=>{
        console.log("Item guardado")
        res.status(201).json({ok:true, reporte:flashreport})
    })
    
    .catch((err)=>console.log(err))


    const doc = new PDFDocument();
    const pdffilename = `reports/FlashReport ${Date.now()}.pdf`
    doc.pipe(fs.createWriteStream(pdffilename))
    doc.text(req.body.reporte)
    doc.end()

    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: 'edgard.carrillo@minsur.com',
          pass: process.env.PASSWORDMAIL
        }
      });
    

      const mailOptions = {
        from: 'edgard.carrillo@minsur.com',
        to: 'edgard.carrillo@montagna.com.pe',
        subject: '[FlashReport] Generación de Flashreport',
        text: 'Please find attached your PDF',
        attachments: [
          {
            path: pdffilename
          }
        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send('Error sending email.');
        } else {
          console.log('Email sent successfully!');
          res.send('PDF sent via email!');
        }
      });

    }


//Borrar datos
const deletereport = async (req,res)=>{
    console.log("solicitud de elminación recibida");
    //params es para poder acceder al ":id" que se ha definido en la ruta (routes/products) en la fila de deleteproducts
    const {id} = req.params
    await report.findByIdAndUpdate(id,{
        deleted:true
    })
    res.status(200).json({ok:true})
    console.log({id}); 

}

   
//Obtener datos por id
const getreportdetail =  async (req,res)=>{
    const {id} = req.params
    const reports = await report.findById(id)
    // const reports1 = await report.findByIdAndUpdate(id)
    //const reports = await report.find({deleted:false}).sort({_id:'desc'})
    res.status(200).json({ok: true, data:reports})
    }

    module.exports = {
        getreport,
        createreport,
        deletereport,
        getreportdetail
    } 