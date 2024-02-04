const express = require("express")
const Auditorium = require("../model/auditorium")
const router = express.Router()

router.get("/", async (req, res) => {
    const auditoriums = await Auditorium.find({ isdeleted: false })
    return res.json({ error: false, data: { auditoriums } })
})

module.exports = router
