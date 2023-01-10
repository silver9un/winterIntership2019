const log = require("../logger/logger.js")
const fs = require("fs")
const configuration = require("../config/config.js")

const SUCCESS_CODE = 200
const ERROR_CODE = 503
var Devicedata

function readConfiguration() {
  log.info('configuration call')
  return new Promise(function(resolve, reject) {
    config = configuration.init();
    if(config) {
      Devicedata = config
      resolve(config)
    } else {
      reject('Error')
    }
  })
}
module.exports = {
  getData: function(recvData) {
    readConfiguration()
    let result
    log.info('getData call')
    return new Promise(function(resolve, reject) {
      let msgJson = {
      "responseCode" : 200,
      "items":[  //items -> groups
          {
          "resource" : "PhilipsHue.Bridge1.1.1",
          "power":"on",
          "color":{ "hue":255, "saturation":200, "brightness":200 },
          "colorTemperature":2500, //1번 그룹
          },
          {
          "resource" : "PhilipsHue.Bridge1.2.1",
          "power":"on",
          "color":{ "hue":255, "saturation":200, "brightness":200 },
          "colorTemperature":2500, //2번 그룹
        }]
      }

      if(msgJson) {
        var request = require('request')
        var group1url = Devicedata.group1url
        var group2url = Devicedata.group2url
        //group1url = Devicedata[0].Bridge_IP+ Devicedata[0].UserName + Devicedata[0].group1
        //group2url = Devicedata[0].Bridge_IP+ Devicedata[0].UserName + Devicedata[0].group2
        //var url = Devicedata[0].Bridge_IP+ Devicedata[0].UserName
        request({
            url: group1url,
            method: 'GET',
        }, function(err, response, body) {
            var group1status = JSON.parse(body)
            var group1on = group1status.action.on
            var group1bri = group1status.action.bri
            var group1hue = group1status.action.hue
            var group1sat = group1status.action.sat
            var group1ct = group1status.action.ct
              
            msgJson.items[0].power = group1on
            msgJson.items[0].color.hue = group1hue
            msgJson.items[0].color.saturation = group1sat
            msgJson.items[0].color.brightness = group1bri
            msgJson.items[0].colorTemperature = group1ct
    
            request({ 
              url: group2url,
              method: 'GET',
              }, function(err, response, body) {
              var group2status = JSON.parse(body)
              var group2on = group2status.action.on
              var group2bri = group2status.action.bri
              var group2hue = group2status.action.hue
              var group2sat = group2status.action.sat
              var group2ct = group2status.action.ct
              
              msgJson.items[1].power = group2on
              msgJson.items[1].color.hue = group2hue
              msgJson.items[1].color.saturation = group2sat
              msgJson.items[1].color.brightness = group2bri
              msgJson.items[1].colorTemperature = group2ct
    
              log.info(msgJson)
              resolve(msgJson)
              })
          })
    
      } else {
        reject('Error')
      }
    })
    result = SUCCESS_CODE
    return result
  }
}
module.exports = {
  setData: function(recvData) {

    function putmethod(recvData) {
      readConfiguration()
      //i = 0 전체 i = 1 1번그룹 i = 2 2번그룹
      log.info('putmethod call')
      var i = 0
      var request = require('request')
      var url = Devicedata.url
      var on = Boolean
      //log.error(Object.keys(recvData.set))
    if (Object.keys(recvData.set) == "power") {
          if (recvData.set.power == "on")
            on = true
          else
            on = false  }

      if (Object.keys(recvData.set) == "color") {
        var sat = recvData.set.color.saturation
        var hue = recvData.set.color.hue
        var bri = recvData.set.color.brightness }

      if (Object.keys(recvData.set) == "colorTemperature") {
        var ct = recvData.set.colorTemperature  }

      if(recvData.target == "PhilipsHue")
        i = 0
        else if (recvData.target == "PhilipsHue.Bridge1.1.1")
        i = 1
        else if (recvData.target == "PhilipsHue.Bridge1.2.1")
        i = 2

      request({
          url: url + i + "/action",
          method: 'PUT',
          body: JSON.stringify({"on":on, "sat":sat, "bri":bri, "hue":hue, "ct":ct})
          })
      log.info("putmethod excuted")

      return recvData
  }

  
    log.info('setData call')
    return new Promise(function(resolve, reject) {    
      //To Do Something....
      putmethod(recvData)
      let msgJson = {SUCCESS_CODE, recvData}
      //log.warn(msgJson)
      resolve(msgJson)
    })
  }
}

