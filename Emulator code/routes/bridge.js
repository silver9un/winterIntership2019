const bodyParser = require('body-parser')
const fs = require("fs")
const express = require("express")
const router = express.Router()

/*
var allowCrossDomain = function(req, res, next) {
  console.log(allowCrossDomain)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
      res.end()
  } else {
      next()
  }
}


var sendJSON = function(req, res, next) {
  console.log(sendJSON)
  res.header('Content-Type', 'application/json; charset=UTF-8')
  next()
}
*/

//router.use(bodyParser.text({ type: 'text/html' }))
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
//router.use(allowCrossDomain)
//router.use(sendJSON)

let model, hue, sensibo
var socket

router.use(function(req, res, next) {
  socket = req.app.get('socketio')
  console.log('req.body => ', req.body)
  socket.emit('receive', JSON.stringify(req.body), null, '\t')
  next()
})

function getData(req, res) {
  console.log(getData)
  return new Promise(function(resolve, reject) {
    if(!model) {
      fs.readFile(__dirname + "/../models/" + "model.json", 'utf8', function(err, data) {
        console.log('model null')
        model = JSON.parse(data)
        //console.log(model)
        resolve(model)
      })
    }
    else {
      console.log('model have data')
      //console.log(model)
    }
  })
}

function checkundefined(data) {
  if (typeof data === 'undefined')
    return true
}

function checkInteger(data) {
  if(!Number.isInteger(data)) {
    return true
  }
}

router.use(function (req, res, next) {
  console.log('------------------------------')
  console.log('bridge something use')
  getData()
  hue = model.hue
  sensibo = model.sensibo
  //console.log(hue)
  //console.log(sensibo)
  next()
})

getData().then(
  router.get('/hue', function(req, res) {
    console.log('router get /hue')
    socket.emit('state', JSON.stringify(hue, undefined, '\t'))
    //res.send(JSON.stringify(light.lights[0]))
    res.send(hue)
  }),
  
  router.get('/hue/:id', function(req, res) {
    var id = req.params.id
    console.log('router get /hue/:id', id)
    socket.emit('state', JSON.stringify(hue[id], undefined, '\t'))
    //res.send(JSON.stringify(light.lights[id-1]))
    res.send(hue[id])
  }),
  
  router.route('/hue/:id/action')
    .get(function(req, res) {
      var id = req.params.id
      console.log('router get /hue/:id/action', id)
      socket.emit('state', JSON.stringify(hue[id].action, undefined, '\t'))
      //res.send(JSON.stringify(light.lights[id-1].state))
      res.send(hue[id].action)
    })
  
    
    .put(function(req, res) {
      var result = {}
      var id = req.params.id

      var huekeys = Object.keys(hue[id].action)
      var reqkeys = Object.keys(req.body)
      var reqkey, huekey
      var check = 0

      console.log('*****************')
      for(var i=0; i<reqkeys.length; i++) {
        check = 0
        reqkey = reqkeys[i];
        console.log(reqkey, req.body[reqkey]);

        for(var j=0; j<huekeys.length; j++) {
          huekey = huekeys[j];
          //console.log(huekey, hue[id].action[huekey]);

          if(huekey === reqkey) {
            check = 1
            continue
          }
        }
        if(check == 0) {
          result["success"] = 0
          result["error"] = reqkey + ": invalid request"
          console.log(reqkey, ': invalid request')
          res.json(result)
          //return
        }
      }

      var on = req.body.on
      var bri = req.body.bri
      var ahue = req.body.hue
      var sat = req.body.sat
      var ct = req.body.ct

      /*
      var keys = Object.keys(req.body);
      for(var i=0; i<keys.length; i++){
          var key = keys[i];
          console.log(key, req.body[key]);
      }
      */

      /*
      bri 1 -254
      sat 0 - 254
      hue 0 - 65535
      ct 153 - 500
      */
      
      console.log('req.body.on => ', on)
      console.log('req.body.bri => ', bri)
      console.log('req.body.hue => ', ahue)
      console.log('req.body.sat => ', sat)
      console.log('req.body.ct => ', ct)

      

      if (checkundefined(on)) { }
      else if(typeof on === 'boolean') {
        hue[id].action.on = on
      } else {
        console.log('on is not boolean(true/false)')
        result["success"] = 0
        result["error"] = "on is not boolean(true/false)"
        res.json(result)
        //return
      }
      
      if (checkundefined(bri)) { }
      else if(checkInteger(bri)) {
        console.log('bri is not integer')
        result["success"] = 0
        result["error"] = bri + " bri is not integer"
        res.json(result)
        //return
      } else if (0 < bri && bri < 255) {
        hue[id].action.bri = bri
      } else {
        result["success"] = 0
        result["error"] = "bri is an integer of 0 < bri < 255"
        res.json(result)
        //return
      }

      if (checkundefined(ahue)) { }
      else if(checkInteger(ahue)) {
        console.log('hue is not integer')
        result["success"] = 0
        result["error"] = ahue + " hue is not integer"
        res.json(result)
        //return
      } else if (0 <= ahue && ahue < 65536) {
        hue[id].action.hue = ahue
      } else {
        result["success"] = 0
        result["error"] = "hue is an integer of 0 <= hue < 65536"
        res.json(result)
        //return
      }
      
      if (checkundefined(sat)) { }
      else if(checkInteger(sat)) {
        console.log('sat is not integer')
        result["success"] = 0
        result["error"] = sat + " sat is not integer"
        res.json(result)
        //return
      } else if (0 <= sat && sat < 255) {
        hue[id].action.sat = sat
      } else {
        result["success"] = 0
        result["error"] = "sat is an integer of 0 <= sat < 255"
        res.json(result)
        //return
      }

      if (checkundefined(ct)) { }
      else if(checkInteger(ct)) {
        console.log('ct is not integer')
        result["success"] = 0
        result["error"] = ct + " ct is not integer"
        res.json(result)
        //return
      } else if (152 < ct && ct < 501) {
        hue[id].action.ct = ct
      } else {
        result["success"] = 0
        result["error"] = "ct is an integer of 152 < ct < 501"
        res.json(result)
        //return
      }
  
      if(result.success == 0) {
        console.log('--------failed---------')
        socket.emit('state', JSON.stringify(result, undefined, '\t'))
      } else {
        //socket.emit('state', JSON.stringify(hue[id], null, '\t'))
        socket.emit('state', JSON.stringify(hue[id], undefined, '\t'))

        res.send(hue[id])
      }
    }),

  router.get('/sensibo', function(req, res) {
    console.log('router get /sensibo')
    socket.emit('state', JSON.stringify(sensibo, undefined, '\t'))
    //res.send(JSON.stringify(light.lights[0]))
    res.send(sensibo)
  }),

  router.get('/sensibo/current', function(req, res) {
    
    console.log('router get /hue/current')
    socket.emit('state', JSON.stringify(sensibo.current, undefined, '\t'))
    //res.send(JSON.stringify(light.lights[id-1]))
    res.send(sensibo.current)
  }),

  router.route('/sensibo/acState')
    .get(function(req, res) {
    
      console.log('router get /hue/acState')
      socket.emit('state', JSON.stringify(sensibo.acState, undefined, '\t'))
      //res.send(JSON.stringify(light.lights[id-1]))
      res.send(sensibo.acState)
    })

    .post(function(req, res) {
      /*
        "on":false, //true, false
        "mode":"cool", //cool, dry, fan, auto
        "fanLevel":"high", //low, medium, high, auto
        "targetTemperature":23,//18~30
      */

      var checkmode = ['cool', 'dry', 'fan', 'auto']
      var checkfan = ['low', 'medium', 'high', 'auto']

      var result = { }

      var reqkeys = Object.keys(req.body)
      var reqkey, senkey
      var check = 0

      console.log('*****************')
      for(var i=0; i<reqkeys.length; i++) {
        check = 0
        reqkey = reqkeys[i];
        console.log(reqkey, req.body[reqkey]);

        for(var j=0; j<4; j++) {
          senkey = sensibo.changedProperties[j];
          console.log(senkey)

          if(senkey === reqkey) {
            check = 1
            continue
          }
        }
        if(check == 0) {
          result["success"] = 0
          result["error"] = reqkey + ": invalid request"
          console.log(reqkey, ': invalid request')
          res.json(result)
          //return
        }
      }

      var on = req.body.on
      var targetTemperature = req.body.targetTemperature
      var mode = req.body.mode
      var fanLevel = req.body.fanLevel

      console.log('on =>', on)
      console.log('targettemp =>', targetTemperature)
      console.log('mode =>', mode)
      console.log('fanLevel =>', fanLevel)

      if (checkundefined(on)) { }
      else if(typeof on === 'boolean') {
        sensibo.acState.on = on
      } else {
        console.log('on is not boolean(true/false)')
        result["success"] = 0
        result["error"] = "on is not boolean(true/false)"
        res.json(result)
        //return
      }

      check = 0
      for(var i = 0; i < 4; i++) {
        if(checkmode[i] == mode)
          check = 1
      }

      if (checkundefined(mode)) { }
      else if(check == 1) {
        sensibo.acState.mode = mode
      } else {
        result["success"] = 0
        result["error"] = "mode in [cool, dry, fan, auto]"
        res.json(result)
      }

      if (checkundefined(targetTemperature)) { }
      else if(checkInteger(targetTemperature)) {
        console.log('temperature is not integer')
        result["success"] = 0
        result["error"] = "temperature is not integer"
        res.json(result)
        //return
      } else if (17 < targetTemperature && targetTemperature < 31) {
        sensibo.acState.targetTemperature = targetTemperature
      } else {
        result["success"] = 0
        result["error"] = "temperature is an integer of 0 < temperature < 255"
        res.json(result)
        //return
      }

      check = 0
      for(var i = 0; i < 4; i++) {
        if(checkfan[i] == fanLevel)
          check = 1
      }

      if (checkundefined(fanLevel)) { }
      else if(check == 1) {
        sensibo.acState.fanLevel = fanLevel
      } else {
        result["success"] = 0
        result["error"] = "fanLevel in [low, medium, high, auto]"
        res.json(result)
      }

      if(result.success == 0) {
        console.log('--------failed---------')
        socket.emit('state', JSON.stringify(result, undefined, '\t'))
      } else {
        //socket.emit('state', JSON.stringify(hue[id], null, '\t'))
        socket.emit('state', JSON.stringify(sensibo.acState, undefined, '\t'))
        res.send(hue[id])
      }
      
      

      console.log(sensibo.acState)

      res.send(sensibo.acState)
    })
)

module.exports = router