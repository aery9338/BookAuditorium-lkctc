const Joi = require("joi")
const { name } = require("../utils/limit")

const validateAuditoriumCreateReq = (auditorium) => {
    return Joi.object({
        title: Joi.string().required(),
        images: Joi.array(),
        destination: Joi.object({
            block: Joi.string(),
            floor: Joi.string(),
        }),
        description: Joi.string().required(),
        capacity: Joi.number().required(),
        features: Joi.array().items({
            name: Joi.string(),
            description: Joi.string(),
        }),
        createdby: Joi.string(),
    }).validate(auditorium)
}

const validateAuditoriumUpdateReq = (auditorium) => {
    return Joi.object({
        title: Joi.string(),
        images: Joi.array(),
        destination: Joi.object({
            block: Joi.string(),
            floor: Joi.string(),
        }),
        description: Joi.string(),
        capacity: Joi.number(),
        features: Joi.array().items({
            name: Joi.string(),
            description: Joi.string(),
        }),
        modifiedby: Joi.string(),
    }).validate(auditorium)
}

const validateAuditoriumDeleteReq = (auditorium) => {
    return Joi.object({
        isdeleted: Joi.boolean(),
        modifiedby: Joi.string(),
    }).validate(auditorium)
}

const validateAdminUserCreateReq = (faculty) => {
    return Joi.object({
        displayname: Joi.string().regex(name.regex).required(),
        email: Joi.string().required().min(5).max(255).email(),
        roles: Joi.array(),
        createdby: Joi.string(),
    }).validate(faculty)
}

const validateAdminUserCreateBulkReq = (bulkFacultyData) => {
    return Joi.array()
        .items({
            displayname: Joi.string().regex(name.regex).required(),
            email: Joi.string().required().min(5).max(255).email(),
            roles: Joi.array(),
        })
        .validate(bulkFacultyData)
}

const validateAdminUserUpdateReq = (faculty) => {
    return Joi.object({
        displayname: Joi.string().regex(name.regex),
        roles: Joi.array(),
        modifiedby: Joi.string().required(),
    }).validate(faculty)
}

const validateAdminUserDeleteReq = (faculty) => {
    return Joi.object({
        isdeleted: Joi.boolean(),
        modifiedby: Joi.string().required(),
    }).validate(faculty)
}

module.exports = {
    validateAuditoriumCreateReq,
    validateAuditoriumUpdateReq,
    validateAuditoriumDeleteReq,
    validateAdminUserCreateBulkReq,
    validateAdminUserCreateReq,
    validateAdminUserUpdateReq,
    validateAdminUserDeleteReq,
}
