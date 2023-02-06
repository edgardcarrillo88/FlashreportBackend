const express = require('express')
require('dotenv').config()
const dbconnect = require("./database")
const path = require('path')
const reportcontroller = require('./routes/reports')
const cors = require('cors')
const app = express()
const userscontroller = require('./routes/users')


dbconnect(app)

app.use(cors())
app.use(express.json())

app.use('/api/v1/flashreport',reportcontroller)
app.use('/api/v1/users',userscontroller)

app.use(express.static(path.join(__dirname,'public')))