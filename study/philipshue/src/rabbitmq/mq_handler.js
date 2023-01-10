const log = require("../logger/logger.js")
const mongodb = require("../models/mongodb.js")
const device = require("../device/device.js")
const sendMQ = require("./send_mq.js")
const recvMQ = require("./recv_mq.js")

const SUCCESS_CODE = 200
const ERROR_CODE = 503
let recvData = {}

function recvRequestStatus(msg) {
  log.info(msg.content.toString())
  let recvMsgJson = JSON.parse(msg.content.toString())
  log.info(recvMsgJson)

  return recvMsgJson
}

function controlDevice(recvData) {
  log.info('controlDevice call')
  return new Promise(function(resolve, reject) {
    if(recvData.command == 'getStatus') {
      let resultCode = device.getData(recvData)
      resolve(resultCode)
    }
    else if(recvData.command == 'setStatus') {
     let resultCode = device.setData(recvData)
     resolve(resultCode)
    }
  })
}

function sendResponseToHost(resultCode) {
  log.info('sendResponseToHost call')
 //log.warn(resultCode)
  return new Promise(function(resolve, reject) {
    let routingKey = recvData.resource
    let responseMessage = {
      responseCode : resultCode
    }

    let msgString = JSON.stringify(responseMessage)
    sendMQ.send(routingKey, msgString, function (err, result) {
      if(result) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  start: function(config) {
    recvMQ.listen(function(err, msg) {
      if (msg) {
        recvData = recvRequestStatus(msg)
        if(recvData.command == 'getStatus') {
          Promise.resolve(recvData)
          .then(controlDevice)
          .then(sendResponseToHost)
          .catch(function(err) {
            log.error('Error', err)
          })
        }
        else if(recvData.command == 'setStatus') {
          Promise.resolve(recvData)
          .then(controlDevice)
          .then(sendResponseToHost)
          .catch(function (err) {
            log.error('Error', err)
          })
        } 
      }
    })
  }
}
