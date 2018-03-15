const api = require('./etherscanApi')
const _ = require('lodash')
const Address = require('../models/address')
const web3 = require('web3-utils')

/**
 * Fetches an address's ETH balance and updates the Address record
 */
class BalanceQueryingService {
  constructor(address) {
    this.address = address
  }

  async perform() {
    const response = await api.account.balance(this.address)

    if (response.message !== 'OK') {
      // Let this bubble up to our error handling in the caller
      throw new Error('Invalid status response from Etherscan API')
    }

    // Stretch Goal:  Include the top 10 ERC-20 token balances
    const ethBalance = web3.fromWei(response.result, 'ether')
    console.log('Eth balance: ' + ethBalance)
    await Address.updateOne({ address: this.address }, { ethBalance })
    console.log('Success updating the address balance')
  }
}

module.exports = BalanceQueryingService
