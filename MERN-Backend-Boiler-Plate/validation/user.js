const Joi = require("joi")
const { password, name, username } = require("../utils/limit")

const validateUserCreateReq = (user) => {
    return Joi.object({
        username: Joi.string().regex(username.regex),
        displayname: Joi.string().regex(name.regex).required(),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().regex(password.regex).required().min(8).max(1024),
        roles: Joi.array(),
        createdby: Joi.string(),
        modifiedby: Joi.string(),
    }).validate(user)
}

const validateUserSignUpReq = (user) => {
    return Joi.object({
        username: Joi.string().regex(username.regex),
        displayname: Joi.string().regex(name.regex).required(),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().regex(password.regex).required().min(8).max(1024),
        roles: Joi.array(),
        createdby: Joi.string(),
        modifiedby: Joi.string(),
    }).validate(user)
}

const validateUserLoginReq = (user) => {
    return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().regex(password.regex).required().min(8).max(1024),
    }).validate(user)
}

module.exports = {
    validateUserCreateReq,
    validateUserSignUpReq,
    validateUserLoginReq,
}
