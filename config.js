// A simple config object for the application
module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'ether-eye'
  },
  port: process.env.PORT || 3000,
  etherscan: {
    apiKey: 'B36MHYW97QWKU4BTRAJ6587JG55UDW7ANN',
    timeoutMs: 25000,
    // Max transaction response size from Etherscan API
    maxTxSize: 10000
  }
}
