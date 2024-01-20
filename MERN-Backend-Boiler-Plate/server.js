require("dotenv").config()
const express = require("express")
const winston = require("winston")
const app = express()
const cors = require("cors")
const routes = require("./routes")
const bodyParser = require("body-parser")
const server = require("http").Server(app)
require("./startup/logger")(app)
require("./startup/websocket")(server)
// require("./startup/dailyschedular")()
require("./startup/db")()

const initialize = () => {
    const PORT = process.env.APP_PORT || 5000
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use("/", require("./routes/homeRoute"))
    app.use("/api", routes)

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
