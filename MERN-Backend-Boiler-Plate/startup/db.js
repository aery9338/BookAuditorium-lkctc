const mongoose = require("mongoose")
const winston = require("winston")
const { ProjectDB } = require("./config")

module.exports = async () => {
    return await mongoose.connect(ProjectDB).then(() => winston.info("Connected to MongoDB Successfully."))
}
