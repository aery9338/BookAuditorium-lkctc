let connectedClients = 0 // Counter for connected clients

module.exports = async (server) => {
    const io = require("socket.io")(server, { cors: { origin: "*" } })

    io.on("connection", (socket) => {
        console.log("Client connected: ", ++connectedClients)

        socket.on("heartbeat", () => {
            // Handle heartbeat event
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected: ", --connectedClients)
        })
    })
}
