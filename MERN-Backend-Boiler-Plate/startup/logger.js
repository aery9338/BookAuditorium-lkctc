const winston = require("winston")
const expressWinston = require("express-winston")
const appConfig = require("./config")
require("winston-mongodb")

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const formattedLogTime = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear().toString().slice(-2)
    const month = months[currentDate.getMonth()]
    const day = currentDate.getDate().toString().padStart(2, "0")
    const hours = currentDate.getHours()
    const formattedHours = hours > 12 ? (hours - 12).toString().padStart(2, "0") : hours
    const minutes = currentDate.getMinutes().toString().padStart(2, "0")
    const seconds = currentDate.getSeconds().toString().padStart(2, "0")
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    return `${day} ${month} ${year}, ${formattedHours}:${minutes}:${seconds}:${milliseconds} ${ampm}`
}

module.exports = async (app) => {
    winston.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.printf(({ level, message }) => `[${level}]: ${message} - ${formattedLogTime()}`)
            ),
        })
    )

    winston.add(
        new winston.transports.File({
            level: "silly",
            filename: "logs/infoLog.log",
            format: winston.format.combine(
                winston.format.printf(({ level, message }) => `[${level}]: ${message} - ${formattedLogTime()}`)
            ),
        })
    )

    // Add the Winston logger middleware to the app
    await app.use(
        expressWinston.logger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.printf(({ level, message }) => `[${level}]: ${message} - ${formattedLogTime()}`)
                    ),
                }),
                new winston.transports.File({
                    level: "silly",
                    filename: "logs/infoLog.log",
                }),
                new winston.transports.File({
                    level: "error",
                    filename: "logs/errorLog.log",
                    handleExceptions: true,
                    handleRejections: true,
                }),
                new winston.transports.MongoDB({
                    level: "error",
                    db: appConfig.ProjectDB,
                    collection: "errorLogs",
                    options: {
                        useUnifiedTopology: true,
                        useNewUrlParser: true,
                    },
                    handleExceptions: true,
                    handleRejections: true,
                }),
                new winston.transports.MongoDB({
                    level: "silly",
                    db: appConfig.ProjectDB,
                    collection: "infoLogs",
                    options: {
                        useUnifiedTopology: true,
                        useNewUrlParser: true,
                    },
                }),
            ],
            format: winston.format.combine(
                winston.format.errors(),
                winston.format.timestamp(),
                winston.format.uncolorize(),
                winston.format.metadata(),
                winston.format.json(),
                winston.format.splat()
            ),
            requestWhitelist: ["body", "headers", "method", "params", "query", "url"],
            responseWhitelist: ["body", "headers", "statusCode"],
            expressFormat: true,
            statusLevels: true,
            colorize: false,
            // eslint-disable-next-line no-unused-vars
            ignoreRoute: function (req, res) {
                return req.method === "OPTIONS"
            },
        })
    )
}
