const mongoose = require('mongoose')
const _ = require('lodash')

const AddressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'OK', 'FAILED'],
      default: 'PENDING',
      required: true
    },
    ethBalance: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

AddressSchema.methods.toJSON = function() {
  const obj = this.toObject()
  return _.pick(obj, ['address', 'status', 'ethBalance', 'createdAt', 'updatedAt'])
}

module.exports = mongoose.model('Address', AddressSchema)
