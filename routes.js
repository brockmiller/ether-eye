const express = require('express')
const router = express.Router()
const addresses = require('./controllers/addresses')
const asyncHandler = require('express-async-handler')

router.get('/', (req, res) => res.send('Hello World'))

// ADDRESS ROUTES
router.get('/addresses', asyncHandler(addresses.getAddresses))
router.post('/addresses', asyncHandler(addresses.createAddress))
router.get('/addresses/:address', asyncHandler(addresses.getAddress))
router.get('/addresses/:address/transactions', asyncHandler(addresses.getTransactionsForAddress))

module.exports = router
