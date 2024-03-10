const mongoose = require("mongoose")
const { BookingStatus } = require("../utils/constant")

const bookingSchema = new mongoose.Schema(
    {
        auditorium: { type: mongoose.Schema.Types.ObjectId, ref: "Auditorium", required: true },
        staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        title: { type: String, required: true },
        starttime: { type: Date, required: true },
        endtime: { type: Date, required: true },
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
        occasion: {
            type: String,
            enum: ["official", "meeting", "program", "practice", "function", "seminar", "other"],
            default: "pending",
        },
        department: { type: String, enum: ["it", "management", "other"], default: "pending" },
        bookingstatus: {
            type: String,
            enum: [BookingStatus.APPROVED, BookingStatus.CANCELLED, BookingStatus.PENDING, BookingStatus.REJECTED],
            default: "pending",
        },
        purpose: { type: String },
        isdeleted: { type: Boolean, default: false },
        createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        modifiedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking
