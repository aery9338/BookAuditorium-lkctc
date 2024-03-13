require("dotenv").config()
const express = require("express")
const winston = require("winston")
const app = express()
const cors = require("cors")
const routes = require("./routes")
const bodyParser = require("body-parser")
const server = require("http").Server(app)
const initializeSocketIo = require("./startup/webSocket")
const initializeLogger = require("./startup/logger")
const initializeDB = require("./startup/db")
const initializeSchedular = require("./startup/dailyschedular")

const initialize = async () => {
    const PORT = process.env.APP_PORT || 5000
    const io = initializeSocketIo(server)
    app.set("io", io)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    await initializeLogger(app)
    await initializeDB()
    app.use("/api", routes)
    initializeSchedular()

    server
        .listen(PORT, () => {
            winston.info(`Server started at Port: ${PORT}`)
        })
        .on("error", (err) => {
            if (err.errno === "EADDRINUSE") {
                winston.info(`Port ${PORT} is busy, trying with port ${PORT + 1}`)
                app.listen(PORT + 1, () => winston.info(`Server started at Port: ${PORT + 1}`))
            } else winston.info(`Error in server: ${err}`)
        })
}

initialize()
