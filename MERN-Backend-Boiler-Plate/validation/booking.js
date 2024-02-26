const Joi = require("joi")

const validateBookingCreateReq = (user) => {
    return Joi.object({
        auditorium: Joi.string().required(),
        bookingdate: Joi.string().required(),
        createdby: Joi.string().required(),
        department: Joi.string().valid("it", "management", "other").required(),
        endtime: Joi.string().required(),
        occasion: Joi.string()
            .valid("official", "meeting", "program", "practice", "function", "seminar", "other")
            .required(),
        purpose: Joi.string(),
        staff: Joi.string(),
        starttime: Joi.string().required(),
        title: Joi.string().required(),
    }).validate(user)
}

module.exports = {
    validateBookingCreateReq,
}
