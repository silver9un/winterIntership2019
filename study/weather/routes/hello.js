const express = require("express")
const router = express.Router()

router.get("/", function(req, res) {
  console.log("main load")
  res.send("<body><div>Hello World Main!</div></body>")
})

module.exports = router
