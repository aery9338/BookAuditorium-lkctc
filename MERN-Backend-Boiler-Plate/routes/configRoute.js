const express = require("express")
const router = express.Router()

router.get("/", async (req, res) => {
    return res.json({ error: false, data: {} })
})

module.exports = router
