const log = require("../logger/logger.js")

const SUCCESS_CODE = 200
const ERROR_CODE = 503

module.exports = {
  control: function(recvData) {
    let result
    if(recvData.set.mode == "open") {
      log.info("Recv Curtain Open Command")
      result = SUCCESS_CODE
    } else if(recvData.set.mode == "close") {
      log.info("Recv Curtain Close Command")
      result = SUCCESS_CODE
    } else {
      log.info("Recv Curtain Stop Command")
      result = SUCCESS_CODE
    }

    return result
  }
}