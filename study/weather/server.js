"use strict"
const express = require("express")
const fs = require("fs")
const moment = require('moment')
const router = require("./routes")
const log = require("./logger/logger.js")
const mongodb = require("./models/mongodb.js")
const sendMQ = require("./rabbitmq/send_mq.js")
const recvMQ = require("./rabbitmq/recv_mq.js")
const mqHandler = require("./rabbitmq/mq_handler.js")
const configuration = require("./config/config.js")
const keepalive = require("./keepalive/keepalive.js")
const times = require("./times.js")

const fileName = __filename.split("/").pop()
const port = process.env.PORT || 8080
let Devicedata
let config

/* read configuration */
function readConfiguration() {
  log.info('configuration call')
  return new Promise(function(resolve, reject) {
    config = configuration.init()
    if(config) {
      log.info(config)
      resolve(config)
    } else {
      reject('Error')
    }
  })
}

/* dbConnection */
function dbConnection() {
  log.info('dbConnection call')
  return new Promise(function(resolve, reject) {
    mongodb.setServerAddress(config.mongodbUrl)
    mongodb.connect(function(err, result) {
      if(result) {
        resolve(result)
      } else {
        mongodb.close()
        reject(err)
      }
    })
  })
}

/* keepalive remove */
function removeKeepalive() {
  log.info('removeKeepalive call')
  return new Promise(function(resolve, reject) {
    mongodb.removeKeepalive(/SomfyCurtain/i, function(err, result) {
      if (result) {
        log.log(result)
        resolve(result)
      } else {
        console.log(err)
        reject('Error')
      }
    })
  })
}

/* keepalive insert */
function insertKeepalive() {
  log.info('insertKeepalive call')
  return new Promise(function(resolve, reject) {
    let input = {}
    input.resource = config.resource
    input.timeStamp = times.timeStampFormat()
    input.label = config.label
    mongodb.insertKeepalive(input, function(err, result) {
      if (result) {
        log.log(result)
        resolve(result)
      } else {
        console.log(err)
        reject('Error')
      }
    })
  })
}

/* remove property */
function removeProperty() {
  log.info('removeProperty call')
  return new Promise(function(resolve, reject) {
    mongodb.removeProperty(/SomfyCurtain/i, function(err, result) {
      if (result) {
        log.log(result)
        resolve(result)
      } else {
        console.log(err)
        reject('Error')
      }
    })
  })
}

/* read Property */
function readProperty() {
  log.info('readProperty call')
  return new Promise(function(resolve, reject) {
    let obj = JSON.parse(fs.readFileSync('./json/property.json', 'utf8'))
    if(obj) {
      resolve(obj)
    } else {
      reject('Error')
    }
  })
}

/* insert Property */
function insertProperty(obj) {
  log.info('insertProperty call')
  return new Promise(function(resolve, reject) {
    for(let prop in obj) {
      let input = {}
      input.resource = obj[prop].resource
      input.label = obj[prop].label
      input.property = obj[prop].properties
      let result = mongodb.insertProperty(input, function(err, result) {
        if (result) {
          log.log(result)
          resolve(result)
        } else {
          log.error(err)
          reject('Error')
        }
      })
    }
  })
}

/* init MessageQueue */
function initMessageQueueUrl() {
  log.info('initMessageQueueUrl call')
  return new Promise(function(resolve, reject) {
    recvMQ.setServerAddress(config.messageQueueServer)
    recvMQ.setServerRoutingKey(config.resource)
    sendMQ.setServerAddress(config.messageQueueServer)
    resolve()
  })
}

/* start keepalive */
function startKeepalive() {
  log.info('startKeepalive call')
  return new Promise(function(resolve, reject) {
    keepalive.start(config)
    resolve()
  })
}

/* start message queue handler */
function startMQHandler() {
  log.info('startMQHandler call')
  return new Promise(function(resolve, reject) {
    mqHandler.start(config)
    resolve()
  })
}

/* Service Init */
Promise.resolve()
.then(readConfiguration)
.then(dbConnection)
.then(removeKeepalive)
.then(insertKeepalive)
.then(removeProperty)
.then(readProperty)
.then(insertProperty)
.then(initMessageQueueUrl)
.then(startKeepalive)
.then(startMQHandler)
.catch(function (err) {
  log.error('Error', err)
  process.exit()
})

//Web Sever
const app = express()
app.use(router)

app.listen(port, function() {
  log.info("This container working on ", port)
})

//Close
process.on("SIGINT", function() {
  mongodb.close()
  log.info("Get SIGINT!\n")
  process.exit()
})

