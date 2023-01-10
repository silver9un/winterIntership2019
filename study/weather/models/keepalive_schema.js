'use strict'
const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  resource: { type: String, require: true },
  timeStamp: { type: String, require: true },
  label: { type: String, require: true }
})

module.exports = mongoose.model('keepalives', schema)
