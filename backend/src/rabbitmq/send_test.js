#!/usr/bin/env node

const amqp = require("amqplib/callback_api")

amqp.connect(
  "amqp://devops:devops@13.125.234.119:5672",
  function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = "IoT"
      var args = process.argv.slice(2);
      var msg = args.slice(1).join(" ") || "Hello World!";
      var severity = args.length > 0 ? args[0] : "info";

      ch.assertExchange(ex, "direct", { durable: false });
      ch.publish(ex, severity, new Buffer.from(msg));
      console.log(" [x] Sent %s: '%s'", severity, msg);
    })

    setTimeout(function() {
      conn.close()
      process.exit(0)
    }, 500);
  }
);
