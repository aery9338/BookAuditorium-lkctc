const Joi = require("joi")
const { password, name, username } = require("../utils/limit")

const validateUserSignUpReq = (user) => {
    return Joi.object({
        username: Joi.string().regex(username.regex).required(),
        displayname: Joi.string().regex(name.regex).required(),
        dob: Joi.string(),
        gender: Joi.string().valid("male", "female", "other"),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().regex(password.regex).required().min(8).max(1024),
        phone: Joi.string().allow(""),
        address: Joi.string().allow(""),
        city: Joi.string().allow(""),
        state: Joi.string().allow(""),
        zip: Joi.string().allow(""),
        country: Joi.string().allow(""),
        roles: Joi.array().items({
            rolename: Joi.string(),
            isarchived: Joi.boolean(),
            expireOn: Joi.date(),
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

const validateUserUpdateReq = (user) => {
    return Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        dob: Joi.string(),
        gender: Joi.string().valid("male", "female", "other"),
        fathername: Joi.string(),
        mothername: Joi.string(),
        email: Joi.string().required().min(5).max(255).email(),
        modifiedby: Joi.string(),
    }).validate(user)
}

const validateUserLocationUpdateReq = (user) => {
    return Joi.object({
        prefferedname: Joi.string().allow(""),
        contactnumber: Joi.string().allow(""),
        address: Joi.string().allow(""),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.string(),
        country: Joi.string().allow(""),
        modifiedby: Joi.string(),
    }).validate(user)
}

const validateUserRoleUpdateReq = (user) => {
    return Joi.object({
        roles: Joi.array()
            .items({
                rolename: Joi.string().required(),
                isarchived: Joi.boolean(),
                expireOn: Joi.date(),
            })
            .required(),
        modifiedby: Joi.string(),
    }).validate(user)
}

module.exports = {
    validateUserSignUpReq,
    validateUserLoginReq,
    validateUserUpdateReq,
    validateUserLocationUpdateReq,
    validateUserRoleUpdateReq,
}
