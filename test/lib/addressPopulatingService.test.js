require('../helper')
const app = require('../../app').app
const Address = require('../../models/address')
const AddressPopulatingService = require('../../lib/addressPopulatingService')
const TransactionQueryingService = require('../../lib/transactionQueryingService')
const BalanceQueryingService = require('../../lib/balanceQueryingService')

describe('AddressPopulatingService', () => {
  const address = '0x9b68bFaE21DF5A510931A262CECf63f41338F264'
  let addressRecord, service

  before(async () => {
    addressRecord = await Address.create({ address })
    service = new AddressPopulatingService(addressRecord)
  })

  it('sets the status to OK when successful', async () => {
    const txStub = sandbox.stub(TransactionQueryingService.prototype, 'perform')
    const balanceStub = sandbox.stub(BalanceQueryingService.prototype, 'perform')

    await service.perform()

    const addr = await Address.findOne({ address })
    expect(addr.status).to.equal('OK')
  })

  it('sets the status to FAILED when fetching tx fails', async () => {
    const txStub = sandbox.stub(TransactionQueryingService.prototype, 'perform').throws()
    const balanceStub = sandbox.stub(BalanceQueryingService.prototype, 'perform')

    await service.perform()

    const addr = await Address.findOne({ address })
    expect(addr.status).to.equal('FAILED')
  })

  it('sets the status to FAILED when fetching balances fails', async () => {
    const txStub = sandbox.stub(TransactionQueryingService.prototype, 'perform')
    const balanceStub = sandbox.stub(BalanceQueryingService.prototype, 'perform').throws()

    await service.perform()

    const addr = await Address.findOne({ address })
    expect(addr.status).to.equal('FAILED')
  })
})
