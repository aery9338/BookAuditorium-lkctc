const express = require("express")
const router = express.Router()

router.use("/user", require("./userRoute"))
router.use("/admin", require("./adminRoute"))
router.use("/config", require("./configRoute"))
router.use("/auditorium", require("./auditoriumRoute"))
router.use("/booking", require("./bookingRoute"))
router.use("/notification", require("./notificationRoute"))

module.exports = router
