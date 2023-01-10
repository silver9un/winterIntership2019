"use strict"
const consola = require("consola")
const moment = require("moment")

function timeStampFormat() {
  return moment().format("YYYY-MM-DD HH:mm:ss.SSS")
}

/*
  Parameter 1개 일 경우 : arguments[0] 이 메시지
  Parameter 2개 일 경우 : arguments[0]은 tag, arguments[1] 메시지
*/

module.exports = {
  samplePrint: function() {
    consola.fatal(`[${timeStampFormat()}]`, "fatal sample")
    consola.error(`[${timeStampFormat()}]`, "error sample")
    consola.warn(`[${timeStampFormat()}]`, "warn sample")
    consola.info("info sample")
    consola.start("start sample")
    consola.success("success sample")
    consola.ready("ready sample")
    if (process.env.NODE_ENV !== "production") {
      consola.log(`[${timeStampFormat()}]`, "log sample")
    }
    if (process.env.NODE_ENV !== "production") {
      consola.log(`[${timeStampFormat()}]`, "debug sample")
    }
    if (process.env.NODE_ENV !== "production") {
      consola.log(`[${timeStampFormat()}]`, "trace sample")
    }
  },

  fatal: function() {
    if (arguments.length == 1) {
      consola.fatal(`[${timeStampFormat()}]`, arguments[0])
    } else {
      consola.fatal(
        `[${timeStampFormat()}]`,
        `[${arguments[0]}]`,
        arguments[1]
      )
    }
  },

  error: function() {
    if (arguments.length == 1) {
      consola.error(`[${timeStampFormat()}]`, arguments[0])
    } else {
      consola.error(
        `[${timeStampFormat()}]`,
        `[${arguments[0]}]`,
        arguments[1]
      )
    }
  },

  warn: function() {
    if (arguments.length == 1) {
      consola.warn(`[${timeStampFormat()}]`, arguments[0])
    } else {
      consola.warn(`[${timeStampFormat()}]`, `[${arguments[0]}]`, arguments[1])
    }
  },

  info: function(message) {
    if (arguments.length == 1) {
      consola.info(`[${timeStampFormat()}]`, arguments[0])
    } else {
      consola.info(`[${timeStampFormat()}]`, `[${arguments[0]}]`, arguments[1])
    }
  },

  start: function(message) {
    consola.start(message)
  },

  success: function(message) {
    consola.success(message)
  },

  ready: function(message) {
    consola.ready(message)
  },

  log: function(message) {
    if (process.env.NODE_ENV !== "production") {
      if (arguments.length == 1) {
        consola.log(arguments[0])
      } else {
        consola.log(`[${arguments[0]}]`, arguments[1])
      }
    }
  },

  debug: function(message) {
    if (process.env.NODE_ENV !== "production") {
      if (arguments.length == 1) {
        consola.log(`[${timeStampFormat()}]`, arguments[0])
      } else {
        consola.log(
          `[${timeStampFormat()}]`,
          `[${arguments[0]}]`,
          arguments[1]
        )
      }
    }
  },

  trace: function(message) {
    if (process.env.NODE_ENV !== "production") {
      if (arguments.length == 1) {
        consola.log(`[${timeStampFormat()}]`, arguments[0])
      } else {
        consola.log(
          `[${timeStampFormat()}]`,
          `[${arguments[0]}]`,
          arguments[1]
        )
      }
    }
  },

  dir: function(message) {
    console.dir(message)
  }
}
