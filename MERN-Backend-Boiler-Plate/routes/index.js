const express = require("express")
const router = express.Router()

router.use("/user", require("./userRoute"))
router.use("/admin", require("./adminRoute"))
router.use("/config", require("./configRoute"))
router.use("/image", require("./imageRoute"))
router.use("/auditorium", require("./auditoriumRoute"))
router.use("/booking", require("./bookingRoute"))

module.exports = router
