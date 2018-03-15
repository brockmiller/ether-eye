const chai = require('chai')
const db = require('../app').db
const sinon = require('sinon')
const sinonChai = require('sinon-chai');

chai.use(sinonChai)

global.expect = chai.expect
global.sinon = sinon
global.sandbox = sinon.sandbox.create()

afterEach(() => {
  sandbox.restore()
})

after(() => {
  console.log('After all tests...')
  db.db.dropDatabase()
})
