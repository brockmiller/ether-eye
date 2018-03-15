const chai = require('chai')
const db = require('../app').db
const sinonChai = require('sinon-chai');
global.expect = chai.expect

chai.use(sinonChai)

after(() => {
  console.log('After all tests...')
  db.db.dropDatabase()
})
