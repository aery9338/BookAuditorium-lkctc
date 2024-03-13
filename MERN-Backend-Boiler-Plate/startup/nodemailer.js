const nodemailer = require("nodemailer")
const appConfig = require("./config")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: appConfig.officialGmailUser,
        pass: appConfig.officialGmailPass,
    },
})
module.exports = {
    transporter,
}
