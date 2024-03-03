const DocumentStatus = Object.freeze({
    NORMAL: "normal",
    DELETED: "deleted",
    FLAGGED: "flagged",
})

const Gender = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
})

const BookingStatus = Object.freeze({
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
})

const Length = Object.freeze({
    CM: "cm",
    IN: "in",
})

const Time = Object.freeze({
    SECONDS: "s",
    MINUTES: "m",
    HOURS: "h",
    DAYS: "days",
    MONTHS: "months",
    YEARS: "years",
})

const Weight = Object.freeze({
    KG: "kg",
    LB: "lb",
})

module.exports = {
    DocumentStatus,
    Gender,
    BookingStatus,
    Length,
    Time,
    Weight,
}
