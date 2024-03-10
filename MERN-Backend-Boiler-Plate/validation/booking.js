const Joi = require("joi")
const { BookingStatus } = require("../utils/constant")

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
        staff: Joi.array(),
        starttime: Joi.string().required(),
        title: Joi.string().required(),
    }).validate(user)
}

const validateBookingUpdateReq = (user) => {
    return Joi.object({
        bookingstatus: Joi.string()
            .valid(BookingStatus.APPROVED, BookingStatus.CANCELLED, BookingStatus.PENDING, BookingStatus.REJECTED)
            .required(),
    }).validate(user)
}

module.exports = {
    validateBookingCreateReq,
    validateBookingUpdateReq,
}
