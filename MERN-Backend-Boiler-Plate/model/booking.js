const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    auditorium: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auditorium",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        validate: {
            validator: function (v) {
                const today = new Date()
                return v >= today
            },
            message: "Date cannot be in the older then today",
        },
        required: true,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const today = new Date()
                const clgstarttime = today.setHours(8, 0, 0, 0)
                return v >= clgstarttime
            },
            message: "Time should be between college hours",
        },
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                const today = new Date()
                const clgendtime = today.setHours(20, 0, 0, 0)
                return v <= clgendtime
            },
            message: "Time should be between college hours",
        },
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    createdby: {
        type: String,
        required: true,
    },
    modifiedby: {
        type: String,
        required: true,
    },
})

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking
