const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    auditorium: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auditorium",
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    bookingdate: {
        type: Date,
        validate: {
            validator: function (date) {
                const today = new Date()
                return date >= today
            },
            message: "Date can't be older then today",
        },
        required: true,
    },
    starttime: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         const today = new Date()
        //         const clgstarttime = today.setHours(8, 0, 0, 0)
        //         return v >= clgstarttime
        //     },
        //     message: "Time should be between college hours",
        // },
    },
    endtime: {
        type: String,
        required: true,
        // validate: {
        //     validator: function (v) {
        //         const today = new Date()
        //         const clgendtime = today.setHours(20, 0, 0, 0)
        //         return v <= clgendtime
        //     },
        //     message: "Time should be between college hours",
        // },
    },
    department: {
        type: String,
        enum: ["it", "management", "other"],
        default: "pending",
    },
    bookingstatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending",
    },
    occasion: {
        type: String,
        enum: ["official", "meeting", "program", "practice", "function", "seminar", "other"],
        default: "pending",
    },
    purpose: {
        type: String,
    },
    isdeleted: {
        type: Boolean,
        default: false,
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    modifiedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking
