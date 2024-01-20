const { verifyJWToken } = require("./helper")

const adminTokenAuth = (req, res, next) => {
    let token = req?.header("Authorization")?.replace("Bearer ", "")
    if (!token) return res.json({ error: true, message: "Access denied. No token provided." })

    const { error, decoded } = verifyJWToken(token)
    if (error) {
        if (error?.name == "TokenExpiredError") return res.json({ error: true, message: "Token Expired" })
        else return res.json({ error: true, message: "Failed to authenticate token." })
    } else {
        if (!decoded?.roles?.find((role) => role?.rolename) || !decoded._id)
            return res.json({ error: true, message: "Access denied. Admin authorization required." })
        req.userData = decoded
        next()
    }
}

const userTokenAuth = (req, res, next) => {
    let token = req?.header("Authorization")?.replace("Bearer ", "")
    if (!token) return res.json({ error: true, message: "Access denied. No token provided." })

    const { error, decoded } = verifyJWToken(token)
    if (error) {
        if (error.name === "TokenExpiredError") return res.json({ error: true, message: "Token Expired" })
        else return res.json({ error: true, message: "Failed to authenticate token." })
    } else {
        if (!decoded._id) return res.json({ error: true, message: "Access denied. User authorization required." })
        req.userData = decoded
        next()
    }
}

module.exports = {
    adminTokenAuth,
    userTokenAuth,
}
