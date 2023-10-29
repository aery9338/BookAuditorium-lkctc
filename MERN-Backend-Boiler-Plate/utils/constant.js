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

const InviteStatus = Object.freeze({
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
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
    InviteStatus,
    Length,
    Time,
    Weight,
}
