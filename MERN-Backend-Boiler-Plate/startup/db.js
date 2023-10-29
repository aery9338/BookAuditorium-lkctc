const mongoose = require("mongoose")
const winston = require("winston")
const { ProjectDB } = require("./config")

module.exports = () => {
    return mongoose
        .connect(ProjectDB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then(() => {
            console.log("Connected to MongoDB Successfully.")
            winston.info("Connected to MongoDB Successfully.")
        })
}
