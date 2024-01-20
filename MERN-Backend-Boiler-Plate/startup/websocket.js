module.exports = async (server) => {
    const io = require("socket.io")(server, { cors: { origin: "*" } })

    io.on("connection", (socket) => {
        socket.on("heartbeat", () => {})
        socket.on("disconnect", () => {})
    })
}
