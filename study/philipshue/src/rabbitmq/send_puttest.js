#!/usr/bin/env node

const amqp = require("amqplib/callback_api")

amqp.connect(
  "amqp://devops:devops@13.125.234.119:5672",
  function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = "IoTDevice"
      //var args = process.argv.slice(2)
      //var msg = args.slice(1).join(" ") || "Hello World!"
      var msgJson = {
        "command":"setStatus",
        "resource" : "WebService",
        "target" : "PhilipsHue",
        "set" : { //무조건 power, color, colorTemperature 중 한개만 와야함
            "power" : "off",
            //"color":{ "hue":45500, "saturation":200, "brightness":200 }
            //"colorTemperature" : 256
         }
    }
      var msgString = JSON.stringify(msgJson)
      //var severity = args.length > 0 ? args[0] : "info"
      var routingKey = "PhilipsHue"
      ch.assertExchange(ex, "direct", { durable: false })
      ch.publish(ex, routingKey, new Buffer.from(msgString))
      console.log(" [x] Sent %s: '%s'", 'PhilipsHue', msgString)
    })

    setTimeout(function() {
      conn.close()
      process.exit(0)
    }, 500)
  }
)
