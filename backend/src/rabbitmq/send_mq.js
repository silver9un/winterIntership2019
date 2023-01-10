"use strict"
const log = require("../logger/logger.js")
const amqp = require("amqplib/callback_api")
const fileName = __filename.split("/").pop()

let config = {
  serverAddress: "amqp://devops:devops@0.0.0.0:5672",
  ex: "IoT"
}

module.exports = {
  setServerAddress: function(serverAddress) {
    config.serverAddress = serverAddress
  },

  send: function(routingKey, msg, callback) {
    log.info(`${fileName}`, "[SEND] serverAddress = " + config.serverAddress)
    log.info(`${fileName}`, "[SEND] routingKey = " + routingKey)
    log.info(`${fileName}`, "[SEND] ex = " + config.ex)

    amqp.connect(
      config.serverAddress,
      function(err, conn) {
        if (err) {
          log.error(`${fileName}`, "[SEND] amqp.connect " + err)
          callback(err, null)
        }

        conn.createChannel(function(err, ch) {
          if (err) {
            log.error(`${fileName}`, "[SEND] conn.createChannel " + err)
            callback(err, null)
          }

          ch.assertExchange(config.ex, "direct", { durable: false })
          ch.publish(config.ex, routingKey, new Buffer.from(msg))
          log.log("[SEND] Send Message" + " routingKey : " + routingKey)
          log.log(msg)
        });

        setTimeout(function() {
          conn.close()
          process.exit(0)
        }, 500)
      }
    )
  }
}
