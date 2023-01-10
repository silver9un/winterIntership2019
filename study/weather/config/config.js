"use strict"
const fs = require("fs")

let config = {
  resource: '',
  label: '',
  messageQueueServer: '',
  mongodbUrl: '',
  mongodbReadOnlyUrl: '',
  sidoName: '',
  nx: '',
  ny: '',
  ArpltnInforInqireSvc_URL: '',
  SecndSrtpdFrcstInfoService2_URL: '',
  ServiceKey: '',
  numOfRow: '',
  pageNo: '',
  searchCondition: '',

}

module.exports = {
  init: function() {
    let obj = JSON.parse(fs.readFileSync('./json/configuration.json', 'utf8'));

    config.resource = obj.resource
    config.label = obj.label
    config.messageQueueServer = obj.MessagQueue_URL
    config.mongodbUrl = obj.Mongodb_URL
    config.mongodbReadOnlyUrl = obj.Mongodb_ReadOnly_URL
    config.sidoName = obj.Device[0].sidoName
    config.nx=obj.Device[0].nx
    config.ny=obj.Device[0].ny
    config.ArpltnInforInqireSvc_URL=obj.Device[0].ArpltnInforInqireSvc_URL
    config.SecndSrtpdFrcstInfoService2_URL=obj.Device[0].SecndSrtpdFrcstInfoService2_URL
    config.ServiceKey=obj.Device[0].ServiceKey
    config.numOfRow=obj.Device[0].numOfRow
    config.pageNo=obj.Device[0].pageNo
    config.searchCondition=obj.Device[0].searchCondition

    return config
  }
}
