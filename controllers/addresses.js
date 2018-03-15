const Address = require('../models/address')
const Transaction = require('../models/transaction')
const AddressPopulatingService = require('../lib/addressPopulatingService')
const web3 = require('web3-utils')

// There is currently no pagination, so I am limiting the number of results for lists to 100 by default.
// Thist may be overridden on a per-endpoint basis.
const defaultLimit = 100

// Creates a new Ethereum Address record and attempts to fetch transaction and balance information for the
// address.
const createAddress = async (req, res, next) => {
  const address = req.body.address
  if (!address || !web3.isAddress(address)) {
    // Consider refactoring errors into thrown exceptions and dealing with generically in a middleware..
    return res.status(422).send({ error: 'address field is required and must be a valid Ethereum address' })
  }

  let record
  try {
    record = await Address.create({ address: address })
    res.status(201).send(record)

  } catch (e) {
    if (e.name === 'BulkWriteError' && e.message.match(/duplicate key/)) {
      res.status(409).send({ error: 'An address with that value already exists' })
    } else {
      // Pass it on to our error handler(s)
      console.error(e)
      next(e)
    }
  }

  /*
   * If we have a valid record here, then go ahead and asynchronously call to begin fetching the
   * address data, intentionally not using await here to block execution. I am treating this as
   * a cheap way to execute code async (without blocking execution), but am noting that I would
   * much rather have a more formal way of executing and managing async tasks/jobs in a real
   * production system (like a background job scheduler that executes on different processes/machines
   * altogether)
   */
  if (record) {
    const service = new AddressPopulatingService(record)
    // This call handles all of its own errors and will not cause an exception to be raised here.
    service.perform()
  }
}

// Get basic information (including Ether balance) for an address
const getAddress = async (req, res, next) => {
  const address = req.params.address
  const addressRecord = await Address.findOne({ address: address })
  if (!addressRecord) {
    return res.status(404).send()
  }

  res.send(addressRecord)
}

/**
 * Fetches and returns the transactions associated with a particular Ethereum address that
 * is being observed. Results are sorted by blockNumber ascending and this endpoint
 * currently supports the following query parameters:
 *   fromAddress:  'from' address in the transaction | default null
 *   toAddress:    'to' address in the transaction   | default null
 *   startBlock:   blockNumber to start including results from (inclusive) | default 1
 *   endBlock:     blockNumber to stop including results from (inclusive)  | default null
 *   limit:        maximum number of transactions to return | default 100
 */
const getTransactionsForAddress = async (req, res, next) => {
  const address = req.params.address
  const addressRecord = await Address.findOne({ address: address })
  if (!addressRecord) {
    return res.status(404).send()
  }

  let transactions = []
  /*
   * Only fetch transactions if status is OK, which indicates that we have successfully populated transaction
   * and balance information for this address, otherwise just return the address data and an empty list of
   * transactions. The status field in the response will indicate either PENDING or FAILED to the caller.
   */
  if (addressRecord.status === 'OK') {
    // Setup our query params
    const startBlock = req.query.startBlock || 1
    const endBlock = req.query.endBlock
    const fromAddress = req.query.fromAddress
    const toAddress = req.query.toAddress
    const limit = parseInt(req.query.limit) || defaultLimit

    const query = Transaction.
      find({ _address: address }).
      sort({ blockNumer: 'asc' }).
      limit(limit)

    if (startBlock) {
      query.where('blockNumber').gte(startBlock)
    }
    if (endBlock) {
      query.where('blockNumber').lte(endBlock)
    }
    if (fromAddress) {
      query.where({ from: fromAddress })
    }
    if (toAddress) {
      query.where({ to: toAddress })
    }

    transactions = await query
  }

  res.send({
    address: addressRecord,
    transactions: transactions
  })
}

// Index method: Returns a list of Ethereum Addresses which have been observed by this service
const getAddresses = async (req, res, next) => {
  const limit = req.query.limit || defaultLimit
  const addresses = await Address.find().limit(limit)
  res.send(addresses)
}

module.exports = {
  createAddress,
  getAddress,
  getTransactionsForAddress,
  getAddresses
}
