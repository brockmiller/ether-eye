require('../helper')
const app = require('../../app').app
const Address = require('../../models/address')
const Transaction = require('../../models/transaction')
const TransactionQueryingService = require('../../lib/transactionQueryingService')
const txFixture = require('../fixtures/transactions')
const config = require('../../config')
const api = require('../../lib/etherscanApi')

describe('TransactionQueryingService', () => {
  let addressRecord, service

  context('when receiving fewer than maxTxSize transactions in the response', async () => {
    const address = '0x9b68bFaE21DF5A510931A262CECf63f41338F210'
    before(async () => {
      config.etherscan.maxTxSize = txFixture.length + 1
      addressRecord = await Address.create({ address })
      service = new TransactionQueryingService(address)
    })

    it('calls the API once and writes all transactions to the database', async () => {
      const stub = sandbox.stub(api.account, 'txlist').returns({
        message: 'OK',
        result: txFixture
      })

      await service.perform()

      const count = await Transaction.count({ _address: address })
      expect(count).to.equal(txFixture.length)
      expect(stub).to.have.been.calledOnce
    })
  })

  context('when receiving maxTxSize transactions in the first response', async () => {
    const address = '0x1068bFaE21DF5A510931A262CECf63f41338F210'
    before(async () => {
      config.etherscan.maxTxSize = 3
      addressRecord = await Address.create({ address })
      service = new TransactionQueryingService(address)
    })

    it('calls the API twice and writes all transactions to the database', async () => {
      const stub = sandbox.stub(api.account, 'txlist').
        onFirstCall().returns({
          message: 'OK',
          result: txFixture.slice(0, 3)
        }).
        onSecondCall().returns({
          message: 'OK',
          result: txFixture.slice(3, 5)
        })

      await service.perform()

      const count = await Transaction.count({ _address: address })
      expect(count).to.equal(txFixture.length)
      expect(stub).to.have.been.calledTwice
    })
  })
})
