const Address = require('../models/address')

const getAddresses = (req, res) => {
  res.send('list of addresses')
}

const createAddress = async (req, res) => {
  if (!req.body.address) {
    return res.status(422).send('bad input')
  }

  const addr = new Address({ address: req.body.address })
  try {
    await addr.save()
    console.log('saved addr')
    res.status(201).send(addr.address)
  } catch (e) {
    console.log('error ' + e)
    res.status(409).send()
  }
}

const getAddress = (req, res) => {
  res.send('address info for address: ' + req.params.address)
}

const getTransactionsForAddress = (req, res) => {
  res.send('transactions for address: ' + req.params.address)
}

const getBalancesForAddress = (req, res) => {
  res.send('balances for address: ' + req.params.address)
}

module.exports = {
  getAddresses,
  createAddress,
  getAddress,
  getTransactionsForAddress,
  getBalancesForAddress
}
