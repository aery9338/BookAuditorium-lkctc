const Joi = require("joi")

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
    }).validate(auditorium)
}

module.exports = {
    validateAuditoriumCreateReq,
    validateAuditoriumUpdateReq,
}
