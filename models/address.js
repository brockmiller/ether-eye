const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema(
  {
    address: { type: String, index: true, unique: true, lowercase: true },
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Address', AddressSchema)
