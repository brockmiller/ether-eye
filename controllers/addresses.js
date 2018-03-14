const getAddresses = (req, res) => {
  res.send('list of addresses')
}

const createAddress = (req, res) => {
  res.send('creating address: ' + req.params.address)
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
