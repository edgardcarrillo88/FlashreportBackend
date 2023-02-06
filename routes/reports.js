const express = require('express')
const router = express.Router()
const reportcontroller = require('../Controllers/report')
const Upload =  require('../middleware/upload')

router.post('/', Upload.fields([{name:'imagebefore', maxCount:1}, {name:'imageafter', maxCount:1}]), reportcontroller.createreport)
router.get('/',reportcontroller.getreport)
router.delete('/:id',reportcontroller.deletereport)
router.get('/:id',reportcontroller.getreportdetail)

module.exports = router