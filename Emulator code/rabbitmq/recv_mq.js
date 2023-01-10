"use strict"
const log = require("../logger/logger.js")
const amqp = require("amqplib/callback_api")
const fileName = __filename.split("/").pop()

let config = {
  serverAddress: "amqp://devops:devops@0.0.0.0:5672",
  routingKey: ["all", "SomfyCurtain", "MotionBed"],
  ex: "IoTDevice_Emul"
}

module.exports = {
  setServerAddress: function(serverAddress) {
    config.serverAddress = serverAddress
  },

  listen: function(callback) {
    log.info(`${fileName}`, "[RECV] serverAddress = " + config.serverAddress)
    log.info(`${fileName}`, "[RECV] routingKey = " + config.routingKey)
    log.info(`${fileName}`, "[RECV] ex = " + config.ex)

    amqp.connect(
      config.serverAddress,
      function(err, conn) {
        if (err) {
          log.error(`${fileName}`, "[RECV] amqp.connect " + err)
          callback(err, null)
        }

        conn.createChannel(function(err, ch) {
          if (err) {
            log.error(`${fileName}`, "[RECV] conn.createChannel " + err)
            callback(err, null)
          }

          ch.assertExchange(config.ex, "direct", { durable: false })
          ch.assertQueue("", { exclusive: true }, function(err, q) {
            if (err) {
              log.error(`${fileName}`, "[RECV] ch.assertQueue " + err)
              callback(err, null)
            }

            config.routingKey.forEach(function(severity) {
              ch.bindQueue(q.queue, config.ex, severity)
            });

            ch.consume(
              q.queue,
              function(msg) {
                log.log("[RECV] Get Message")
                log.log(msg.content.toString())
                callback(null, msg)
              },
              { noAck: true }
            )
          });
        })
      }
    )
  }
}
