const Joi = require("joi")

const validateAuditoriumCreateReq = (auditorium) => {
    return Joi.object({
        title: Joi.string().required(),
        image: Joi.string(),
        destination: Joi.object({
            block: Joi.string(),
            floor: Joi.string(),
            name: Joi.string().required(),
        }),
        description: Joi.string().required(),
        capacity: Joi.number().required(),
        features: Joi.array().items({
            name: Joi.string().valid("TV", "Mic", "Projector"),
            description: Joi.string(),
        }),
    }).validate(auditorium)
}

const validateAuditoriumUpdateReq = (auditorium) => {
    return Joi.object({
        title: Joi.string(),
        image: Joi.string(),
        destination: Joi.object({
            block: Joi.string(),
            floor: Joi.string(),
            name: Joi.string(),
        }),
        description: Joi.string(),
        capacity: Joi.number(),
        features: Joi.array().items({
            name: Joi.string().valid("TV", "Mic", "Projector"),
            description: Joi.string(),
        }),
    }).validate(auditorium)
}

module.exports = {
    validateAuditoriumCreateReq,
    validateAuditoriumUpdateReq,
}
