"use strict"
const { Observable } = require("rxjs")
const express = require("express")
const router = require("./routes")
const log = require("./logger/logger.js")
const mongodb = require("./models/mongodb.js")
const recvMQ = require("./rabbitmq/recv_mq.js")
const sendMQ = require("./rabbitmq/send_mq.js")

const fileName = __filename.split("/").pop()
const mongodbUrl =
  process.env.MONGODB_URL || "mongodb://13.125.172.123:27017/iot"
const rabbitmqUrl =
  process.env.RABBITMQ_URL || "amqp://devops:devops@13.125.234.119:5672"

//mongodb init
mongodb.setServerAddress(mongodbUrl)
mongodb.connect(function(err, result) {
  if (err) {
    mongodb.close()
  }
})
mongodb.getKeepalive(/Cherish/i, function(err, result) {
  if (result) {
    log.log(result)
  }
})

//Rabbit MQ
recvMQ.setServerAddress(rabbitmqUrl)
recvMQ.listen(function(err, msg) {
  if (msg) {
    log.info(`${fileName}`, msg.content.toString())
  }
})
//sendMQ.setServerAddress(rabbitmqUrl)
//sendMQ.send('all', 'Hello World!!!', function (err, result) {})

//Web Sever
const app = express()
app.use(router)

app.listen(8080, function() {
  log.info("This container working on port 8080!")
});

process.on("SIGINT", function() {
  //To Do Closing
  mongodb.close()

  log.info("Get SIGINT!\n")
  process.exit()
});
