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
  		  "command" : "getStatus", 
  		  "resource" : "WebService",
  		  "target" : "WeatherInformation"
		}
      var msgString = JSON.stringify(msgJson)
      //var severity = args.length > 0 ? args[0] : "info"
      var routingKey = "WeatherInformation"
      ch.assertExchange(ex, "direct", { durable: false })
      ch.publish(ex, routingKey, new Buffer.from(msgString))
      console.log(" [x] Sent %s: '%s'", 'WeatherInformation', msgString)
    })

    setTimeout(function() {
      conn.close()
      process.exit(0)
    }, 500)
  }
)
