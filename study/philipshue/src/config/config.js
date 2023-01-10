"use strict"
const fs = require("fs")

let config = {
  resource: '',
  label: '',
  messageQueueServer : '',
  mongodb : '',
  mongodb_ReadOnly : '',
  bridge_IP : '',
  userName : '',
  group : '',
  //url = ip뒤에 api 뒤에 key(username)
  url : '',
  group1Url :'',
  group2Url :''
}

module.exports = {
  init: function() {
    let obj = JSON.parse(fs.readFileSync('./json/configuration.json', 'utf8'));

    config.resource = obj.resource
    config.label = obj.label
    config.messageQueueServer = obj.MessagQueue_URL
    config.mongodbUrl = obj.Mongodb_URL
    config.mongodb_ReadOnly = obj.Mongodb_ReadOnly_URL
    config.bridge_IP = obj.Device[0].Bridge_IP
    config.userName = obj.Device[0].UserName
    config.group = obj.Device[0].group
    config.url = obj.Device[0].url 
    config.group1Url = obj.Device[0].group1url
    config.group1Url = obj.Device[0].group2url
    return config
  }
}
