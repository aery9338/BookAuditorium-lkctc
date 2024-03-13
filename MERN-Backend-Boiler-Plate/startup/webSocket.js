module.exports = async (server) => {
    const io = require("socket.io")(server, { cors: { origin: "*" } })
    return io
}
