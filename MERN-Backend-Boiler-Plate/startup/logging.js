const winston = require("winston")
const expressWinston = require("express-winston")
const appConfig = require("./config")
require("winston-mongodb")

module.exports = (app) => {
    winston.add(
        new winston.transports.File({
            level: "info",
            log: (megObj) => console.log(megObj?.message),
            filename: "logs/infoLog.txt",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.splat(),
                winston.format.metadata(),
                winston.format.uncolorize(),
                winston.format.json()
            ),
        })
    )

    winston.add(
        new winston.transports.File({
            level: "error",
            filename: "logs/errorLog.txt",
            log: (errorObj) => console.log(errorObj?.message),
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.metadata(),
                winston.format.uncolorize(),
                winston.format.json()
            ),
            handleExceptions: true,
            handleRejections: true,
        })
    )

    winston.add(
        new winston.transports.MongoDB({
            level: "error",
            db: appConfig.ProjectDB,
            collection: "errorLogs",
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.metadata({ fillWith: ["error", "date", "trace"] }),
                winston.format.uncolorize(),
                winston.format.json()
            ),
            handleExceptions: true,
            handleRejections: true,
        })
    )

    // Add the Winston logger middleware to the app
    app.use(
        expressWinston.logger({
            transports: [
                new winston.transports.File({
                    filename: "logs/reqResTimeStatuslog.txt",
                }),
                new winston.transports.MongoDB({
                    db: appConfig.ProjectDB,
                    collection: "reqResTimeStatus",
                    options: {
                        useUnifiedTopology: true,
                        useNewUrlParser: true,
                    },
                }),
            ],
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.uncolorize(),
                winston.format.metadata(),
                winston.format.json()
            ),
            requestWhitelist: ["body", "headers", "method", "params", "query", "url"],
            responseWhitelist: ["body", "headers", "statusCode"],
            expressFormat: true,
            statusLevels: true,
            colorize: false,
        })
    )
}
