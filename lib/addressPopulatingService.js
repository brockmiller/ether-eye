const TransactionQueryingService = require('./transactionQueryingService')
const BalanceQueryingService = require('./balanceQueryingService')
const Address = require('../models/address')

/**
 *  A class that encapsulates logic which is needed to populate transaction and
 * balance information for a given Ethereum address. Handles errors gracefully
 * so that the address.status field is updated appropriately.
 */
class AddressPopulatingService {

  /**
   * Create a new service instance
   * @param {Address} addressRecord
   */
  constructor(addressRecord) {
    this.addressRecord = addressRecord
    this.transactionService = new TransactionQueryingService(this.addressRecord.address)
    this.balanceService = new BalanceQueryingService(this.addressRecord.address)
  }

  /**
   * Performs the work of populating transaction and balance information for the
   * addressRecord and updates the addressRecord.status field appropriately.
   */
  async perform() {
    let status = 'OK'
    try {
      await this.transactionService.perform()
      await this.balanceService.perform()
    } catch (e) {
      console.error(e)
      status = 'FAILED'
    } finally {
      await Address.updateOne({ address: this.addressRecord.address }, { status: status })
    }
  }
}

module.exports = AddressPopulatingService
