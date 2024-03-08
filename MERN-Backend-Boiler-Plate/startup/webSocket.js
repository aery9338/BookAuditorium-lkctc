let connectedClients = 0

module.exports = async (server) => {
    const io = require("socket.io")(server, { cors: { origin: "*" } })

    io.on("connection", (socket) => {
        console.log("Client connected: ", ++connectedClients)
        socket.on("disconnect", () => console.log("Client disconnected: ", --connectedClients))
    })

    return io
}
