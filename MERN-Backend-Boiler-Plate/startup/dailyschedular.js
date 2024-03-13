const schedule = require("node-schedule")
const winston = require("winston")

module.exports = async () => {
    schedule.scheduleJob("0 0 * * * *", async function () {
        winston.info("Program runs at the very first second of every hour")
    })
}
