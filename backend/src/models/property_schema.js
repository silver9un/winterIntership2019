"use strict"
const mongoose = require("mongoose")

let schema = new mongoose.Schema({
  resource: { type: String, require: true },
  label: { type: String, require: true },
  property: { type: Object, require: true }
})

module.exports = mongoose.model("properties", schema)
