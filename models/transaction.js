const mongoose = require('mongoose')
const _ = require('lodash')

const TransactionSchema = new mongoose.Schema(
  {
    _address: {
      type: String,
      required: true,
      index: true,
      lowercase: true
    },
    blockNumber: {
      type: Number,
      index: true
    },
    timeStamp: String,
    hash: String,
    nonce: String,
    blockHash: String,
    transactionIndex: String,
    from: {
      type: String,
      index: true
    },
    to: {
      type: String,
      index: true
    },
    value: String,
    gas: String,
    gasPrice: String,
    isError: String,
    txreceipt_status: String,
    input: String,
    contractAddress: String,
    cumulativeGasUsed: String,
    gasUsed: String,
    confirmations: String
  }
)
TransactionSchema.index({ _address: 1, hash: 1 }, { unique: true })

TransactionSchema.methods.toJSON = function() {
  const obj = this.toObject()
  return _.omit(obj, ['_id', '__v', '_address'])
}

module.exports = mongoose.model('Transaction', TransactionSchema)
