const schedule = require("node-schedule")

module.exports = async () => {
    schedule.scheduleJob("0 0 * * * *", async function () {
        console.log("Program runs at the very first second of every hour")
    })
}
