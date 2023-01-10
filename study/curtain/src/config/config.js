"use strict"
const fs = require("fs")

let config = {
  resource: '',
  label: '',
  messageQueueServer: '',
  mongodbUrl: '',
  mongodbReadOnlyUrl: '',
  deviceIp: ''
}

module.exports = {
  init: function() {
    let obj = JSON.parse(fs.readFileSync('./json/configuration.json', 'utf8'));

    config.resource = obj.resource
    config.label = obj.label
    config.messageQueueServer = obj.MessagQueue_URL
    config.mongodbUrl = obj.Mongodb_URL
    config.mongodbReadOnlyUrl = obj.Mongodb_ReadOnly_URL
    config.deviceIp = obj.Device[0].Device_IP

    return config
  }
}
