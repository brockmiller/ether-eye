const express = require('express')
const router = express.Router()
const addresses = require('./controllers/addresses')

router.get('/', (req, res) => res.send('Hello World'))

// ADDRESS ROUTES
router.get('/addresses', addresses.getAddresses)
router.post('/addresses', addresses.createAddress)
router.get('/addresses/:address', addresses.getAddress)
router.get('/addresses/:address/transactions', addresses.getTransactionsForAddress)
router.get('/addresses/:address/balances', addresses.getBalancesForAddress)

module.exports = router
