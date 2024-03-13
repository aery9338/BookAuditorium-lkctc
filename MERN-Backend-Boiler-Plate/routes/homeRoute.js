const express = require("express")
const router = express.Router()

router.get("/", async (req, res) => {
    return res.send("Hello from Avinav Aery!")
})

router.get("/test", async (req, res) => {
    return res.send("Hello, this is a test route!")
})

module.exports = router
