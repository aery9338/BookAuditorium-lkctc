const jwt = require("jsonwebtoken")

const configureJWTKeys = () => {
    const jwtPrivateKey = process.env.APP_JWT_PRIVATE_KEY
    const jwtRefreshKey = process.env.APP_JWT_REFRESH_KEY
    const jwtPrivateTokenExpiresIn = process.env.APP_JWT_PRIVATE_KEY_EXPIRE_TIME
    const jwtRefreshTokenExpiresIn = process.env.APP_JWT_REFRESH_KEY_EXPIRE_TIME
    return {
        jwtPrivateKey,
        jwtRefreshKey,
        jwtPrivateTokenExpiresIn,
        jwtRefreshTokenExpiresIn,
    }
}

const createJWToken = (valueToEncrypt) =>
    jwt.sign(valueToEncrypt, configureJWTKeys().jwtPrivateKey, {
        expiresIn: `${configureJWTKeys().jwtPrivateTokenExpiresIn}s`,
    })

const createRefreshJWToken = (valueToEncrypt) =>
    jwt.sign(valueToEncrypt, configureJWTKeys().jwtRefreshKey, {
        expiresIn: `${configureJWTKeys().jwtRefreshTokenExpiresIn}s`,
    })

const verifyJWToken = (token) =>
    jwt.verify(token, configureJWTKeys().jwtPrivateKey, (error, decoded) => {
        return { error, decoded }
    })

module.exports = {
    createJWToken,
    createRefreshJWToken,
    verifyJWToken,
}
