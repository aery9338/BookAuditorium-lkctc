const express = require("express")
const router = express.Router()

router.use("/user", require("./userRoute"))
router.use("/admin", require("./adminRoute"))
router.use("/config", require("./configRoute"))
router.use("/test", require("./imageRoute"))

module.exports = router
