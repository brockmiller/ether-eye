const express = require('express')
const app = express()
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')

app.use(bodyParser.json())
app.use('/', routes)

// Catch-all error handler
app.use((err, req, res, next) => {
  res.status(500)
  res.send({ error: err })
})

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
const db = mongoose.connection
db.once('open', () => {
  app.listen(config.port, () => console.log(`ether-eye app listening on port ${config.port}!`))
})

module.exports = { app, db }
