const api = require('./etherscanApi')
const Transaction = require('../models/transaction')
const _ = require('lodash')
const config = require('../config')

/**
 * Fetches transaction history for the Ethereum address and saves the transaction data
 * to the database -- this happens in batches of 10k transactions.
 */
class TransactionQueryingService {
  constructor(address) {
    this.address = address
  }

  async perform() {
    // Fetch transactions for this address
    let moreToFetch = true
    let startBlock = 1
    while (moreToFetch) {
      const response = await api.account.txlist(this.address, startBlock, 'latest', 'asc')
      if (response.message !== 'OK') {
        // Let this bubble up to our error handling in the caller
        throw new Error('Invalid status response from Etherscan API')
      }

      // If we received the max payload size, then we need to bump up the startBlock and check to see if
      // there are more transactions...
      const numResults = response.result.length
      if (numResults === config.etherscan.maxTxSize) {
        startBlock = parseInt(_.last(response.result).blockNumber) + 1
      } else {
        moreToFetch = false
      }

      console.log('Found ' + numResults + ' transactions to process')
      response.result.forEach((r) => r._address = this.address)

      const inserted = await Transaction.insertMany(response.result)
      console.log('Success inserting ' + inserted.length + ' transactions')
    }
  }
}

module.exports = TransactionQueryingService
