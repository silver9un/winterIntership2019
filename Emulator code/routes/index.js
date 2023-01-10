const express = require("express")
const router = express.Router()
const path = require('path')

const bridge = require("./bridge")

router.get('/bridge', function(req, res) {
    console.log('index.html')
    res.sendFile(path.join(__dirname, '../', 'index.html'));
})

router.use("/bridge", bridge)

module.exports = router