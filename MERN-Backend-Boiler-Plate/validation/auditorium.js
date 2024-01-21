const Joi = require("joi")

const validateAuditoriumCreateReq = (auditorium) => {
    return Joi.object({
        tittle: Joi.string().required(),
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
module.exports = {
    validateAuditoriumCreateReq,
}
