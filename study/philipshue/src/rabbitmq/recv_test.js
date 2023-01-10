#!/usr/bin/env node

var amqp = require("amqplib/callback_api")

var args = process.argv.slice(2)

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [all] [webservice] [error]")
  process.exit(1)
}

amqp.connect(
  "amqp://devops:devops@13.125.234.119:5672",
  function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = "IoTWebService"

      ch.assertExchange(ex, "direct", { durable: false })

      ch.assertQueue("", { exclusive: true }, function(err, q) {
        console.log(" [*] Waiting for logs. To exit press CTRL+C")

        args.forEach(function(severity) {
          ch.bindQueue(q.queue, ex, severity)
        })

        ch.consume(
          q.queue,
          function(msg) {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            )

	    console.log(JSON.parse(msg.content.toString()))
          },
          { noAck: true }
        )
      })
    })
  }
)
