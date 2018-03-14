const express = require('express')
const app = express()
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)

app.use(bodyParser.json())
app.use('/', routes)

// Catch-all error handler
app.use((err, req, res, next) => {
  res.status(500)
  res.send({ error: err })
})

app.listen(config.port, () => console.log('Example app listening on port 3000!'))
