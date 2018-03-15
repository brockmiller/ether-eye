const config = require('../config')
const api = require('etherscan-api').init(config.etherscan.apiKey, 'homestead', config.etherscan.timeoutMs)
module.exports = api
