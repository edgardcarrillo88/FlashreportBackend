const path = require('path')
const multer = require('multer')

var Storageimage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null,Date.now() + ext)
    } 
})

var Upload = multer({
    storage: Storageimage
})



module.exports = Upload