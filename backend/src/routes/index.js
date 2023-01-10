const express = require("express")
const router = express.Router()

const hello = require("./hello")

router.use("/hello", hello)

module.exports = router
