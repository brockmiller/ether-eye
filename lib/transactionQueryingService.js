const api = require('./etherscanApi')
const Transaction = require('../models/transaction')

class TransactionQueryingService {
  constructor(address) {
    this.address = address
  }

  async perform() {
    // Fetch transactions for this address
    // TODO: Handle pagination and batch fetching
    const response = await api.account.txlist(this.address, 1, 'latest', 'asc')

    if (response.message !== 'OK') {
      // Let this bubble up to our error handling in the caller
      throw new Error('Invalid status response from Etherscan API')
    }

    console.log('Found ' + response.result.length + ' transactions to process')
    response.result.forEach((r) => r._address = this.address)

    const inserted = await Transaction.insertMany(response.result)
    console.log('Success inserting ' + inserted.length + ' transactions')
  }
}

module.exports = TransactionQueryingService
