const Joi = require("joi")
const { password, name, username } = require("../utils/limit")

const validateUserCreateReq = (user) => {
    return Joi.object({
        username: Joi.string().regex(username.regex),
        displayname: Joi.string().regex(name.regex).required(),
        // dob: Joi.string(),
        // gender: Joi.string().valid("male", "female", "other"),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().regex(password.regex).required().min(8).max(1024),
        // phone: Joi.string().allow(""),
        // address: Joi.string().allow(""),
        // city: Joi.string().allow(""),
        // state: Joi.string().allow(""),
        // zip: Joi.string().allow(""),
        // country: Joi.string().allow(""),
        roles: Joi.array().items({
            rolename: Joi.string(),
            isarchived: Joi.boolean(),
            expireOn: Joi.date(),
        }),
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
        // phone: Joi.string().allow(""),
        roles: Joi.array().items({
            rolename: Joi.string(),
            isinvoked: Joi.boolean(),
        }),
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
