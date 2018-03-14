const config = require('../config')
const api = require('etherscan-api').init(config.etherscanApiKey)
module.exports = api
