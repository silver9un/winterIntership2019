const moment = require('moment')
const log = require("../logger/logger.js")
const mongodb = require("../models/mongodb.js")

const setCorrectedInterval = ((callback, delay) => {
  let startTime
  let count = 0

  const tick = (cb, dl) => {
    if (!count) {
      startTime = Date.now()
      count++

      setTimeout(() => { tick(cb, dl) }, dl)
    } else {
      const delayed = (Date.now() - startTime)
      const correction = (delay * count) - delayed

      callback()
      count++

      setTimeout(() => { tick(cb, dl + correction) }, dl + correction)
    }
  }

  return tick(callback, delay)
})

function timeStampFormat() {
  return moment().format('YYYYMMDDHHmmss')
}

module.exports = {
  start: function(config) {
    let input = {}
    const now = Date.now()
    let timeStamp
    setCorrectedInterval(() => {
      console.log(Date.now() - now)
      input.resource = config.resource
      input.timeStamp = timeStampFormat()
      input.label = config.label
      mongodb.updateKeepalive(input, function(err, result) {
        if (result) {
          log.log(result)
        } 
      })
      console.log(Date.now() - now)
    }, 1000 * 60 * 60)  //1시간 단위
  }
}
