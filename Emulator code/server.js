"use strict"
const express = require("express")
const router = require("./routes")
const log = require("./logger/logger.js")
const recvMQ = require("./rabbitmq/recv_mq.js")
const sendMQ = require("./rabbitmq/send_mq.js")

const fileName = __filename.split("/").pop()
const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://devops:devops@13.125.234.119:5672"

const resString = {
  responseCode : 200
}

let testmsg, jpmsg, appstate

//Web Sever
const app = express()

app.set('set', {
  "Curtain": {
    "command":"setStatus",
    "resource" : "webService",
    "target" : "Curtain",
    "set" : {
      "mode" : "open"
    }
  },
  "MotionBed": {
    "command":"setStatus",
    "resource" : "webService",
    "target" : "MotionBed",
    "set" : {
      "mode" : "zeroG"
    }
  }
})

const server = app.listen(8080, function() {
  log.info("This container working on port 8080!")
})

const io = require('socket.io')(server)

// Set socket.io listeners.
io.on('connection', function(socket) {
  console.log('socket connected')
  //Rabbit MQ
  sendMQ.setServerAddress(rabbitmqUrl)
  recvMQ.setServerAddress(rabbitmqUrl)
  recvMQ.listen(function(err, msg) {
    if (msg) {
      testmsg = msg.content.toString()
      jpmsg = JSON.parse(testmsg)
      log.info(`${fileName}`, testmsg)
      //sendMQ.send('SomfyCurtain', JSON.stringify(resString), function (err, result) {})
      //sendMQ.send('MotionBed', resString, function (err, result) {})
      io.emit('receive', JSON.stringify(jpmsg.set, undefined, '\t'))

      if(jpmsg.target == 'Curtain') {
        appstate = app.get('set').Curtain
        console.log(appstate)

        appstate.set.mode = jpmsg.set.mode

        io.emit('state', JSON.stringify(appstate, undefined, '\t'))
        sendMQ.send('SomfyCurtain', JSON.stringify(resString), function (err, result) {})
      } else if(jpmsg.target == 'MotionBed') {
        appstate = app.get('set').MotionBed
        console.log(appstate)

        appstate.set.mode = jpmsg.set.mode
        io.emit('state', JSON.stringify(appstate, undefined, '\t'))
        sendMQ.send('MotionBed', JSON.stringify(resString), function (err, result) {})
      } else {
        console.log('incorrect target')
        io.emit('state', 'incorrect target')
      }

      

    }
  })
  //sendMQ.setServerAddress(rabbitmqUrl)



  socket.on('disconnect', function() {
    console.log('socket disconnected')
  })
})



app.set('socketio', io)

app.use(router)

process.on("SIGINT", function() {
  //To Do Closing
  //mongodb.close()

  log.info("Get SIGINT!\n")
  process.exit()
});