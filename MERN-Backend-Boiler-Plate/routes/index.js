const express = require("express")
const router = express.Router()

router.use("/admin", require("./adminRoute"))
router.use("/auditorium", require("./auditoriumRoute"))
router.use("/booking", require("./bookingRoute"))
router.use("/config", require("./configRoute"))
router.use("/home", require("./homeRoute"))
router.use("/notification", require("./notificationRoute"))
router.use("/user", require("./userRoute"))

module.exports = router
