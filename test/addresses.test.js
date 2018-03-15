require('./helper')
const app = require('../app').app
const chai = require('chai')
const request = require('supertest')
const Address = require('../models/address')
const Transaction = require('../models/transaction')
const AddressPopulatingService = require('../lib/addressPopulatingService')
const sinon = require('sinon')
const _ = require('lodash')
const txFixture = require('./fixtures/transactions')

describe('Addresses API Tests', () => {
  describe('POST /addresses', () => {
    it('responds with a 422 when there is a blank address', async () => {
      const response = await request(app).post('/addresses').send({ address: '' })
      expect(response.statusCode).to.equal(422)
    })

    it('responds with a 422 when there is an invalid address', async () => {
      const response = await request(app).post('/addresses').send({ address: 'this is not a valid address' })
      expect(response.statusCode).to.equal(422)
    })

    it('creates a record when given a valid address', async () => {
      const address = '0x0d3ed563891ead9319cf9df08536025ae0d1b0bf'
      const response = await request(app).post('/addresses').send({ address: address })

      expect(response.statusCode).to.equal(201)

      const record = await Address.findOne({ address: address })
      expect(record.address).to.equal(address)
      expect(record.status).to.equal('PENDING')
    })

    it('calls to populate transaction and balance data when given a valid address', async () => {
      const address = '0x1d3ed563891ead9319cf9df08536025ae0d1b0bf'
      const stub = sinon.stub(AddressPopulatingService.prototype, 'perform')

      const response = await request(app).post('/addresses').send({ address: address })

      expect(response.statusCode).to.equal(201)

      expect(stub).to.have.been.calledOnce
    })
  })

  describe('GET /addresses/:address', () => {
    const address = '0x1d3ed563891ead9319cf9df08536025ae0d1b0aa'
    let record

    it('responds with a 404 when there is no record', async () => {
      const response = await request(app).get('/addresses/' + address)
      expect(response.statusCode).to.equal(404)
    })

    context('when there is an address present', () => {
      before(async () => {
        record = await Address.create({ address, ethBalance: 10 })
      })

      it('responds with the address info', async () => {
        const response = await request(app).get('/addresses/' + address)
        expect(response.body).to.include(_.pick(record, 'address', 'status', 'ethBalance'))
      })
    })
  })

  describe('GET /addresses/:address/transactions', () => {
    const address = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
    const path = '/addresses/' + address + '/transactions'
    let record

    it('responds with a 404 when there is no record', async () => {
      const response = await request(app).get(path)
      expect(response.statusCode).to.equal(404)
    })

    context('when there is transaction data for a valid address', async () => {
      before(async () => {
        record = await Address.create({ address, ethBalance: 10, status: 'OK' })
        txFixture.forEach((f) => f._address = address)
        await Transaction.insertMany(txFixture)
      })

      it('returns the expected transaction data', async () => {
        const response = await request(app).get(path)

        expect(response.body.address).to.include(_.pick(record, 'address', 'status'))
        expect(response.body.transactions.length).to.equal(5)
      })

      // Test some basic filtering functionality
      it('returns the expected transactions when filtering by toAddress', async () => {
        const response = await request(app).get(path).query({ toAddress: address })

        expect(response.body.address).to.include(_.pick(record, 'address', 'status'))
        expect(response.body.transactions.length).to.equal(4)
      })

      it('returns the expected transactions when using the limit param', async () => {
        const limit = 2
        const response = await request(app).get(path).query({ limit })

        expect(response.body.address).to.include(_.pick(record, 'address', 'status'))
        expect(response.body.transactions.length).to.equal(2)
      })

      it('returns the expected transactions when filtering by fromAddress', async () => {
        const response = await request(app).get(path).query({ fromAddress: address })

        expect(response.body.address).to.include(_.pick(record, 'address', 'status'))
        expect(response.body.transactions.length).to.equal(1)
      })

      it('returns the expected transactions when filtering by startBlock', async () => {
        const blockNumber = 80319
        const response = await request(app).get(path).query({ startBlock: blockNumber })

        expect(response.body.address).to.include(_.pick(record, 'address', 'status'))
        expect(response.body.transactions.length).to.equal(3)
        expect(response.body.transactions[0].blockNumber).to.equal(blockNumber)
      })

      it('returns the expected transactions when filtering by startBlock and endBlock', async () => {
        const startBlock = 80319
        const endBlock = 81426
        const response = await request(app).get(path).query({ startBlock, endBlock })

        expect(response.body.address).to.include(_.pick(record, 'address', 'status'))
        expect(response.body.transactions.length).to.equal(2)
        expect(response.body.transactions[0].blockNumber).to.equal(startBlock)
        expect(response.body.transactions[1].blockNumber).to.equal(endBlock)
      })
    })
  })
})
