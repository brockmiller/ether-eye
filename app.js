const express = require('express')
const app = express()
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/ether_eye')

app.use(bodyParser.json())
app.use('/', routes)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
