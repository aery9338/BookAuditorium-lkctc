const mongoose = require("mongoose")
const { BookingStatus } = require("../utils/constant")

const notificationSchema = new mongoose.Schema(
    {
        notification: { type: String, required: true },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        auditorium: { type: mongoose.Schema.Types.ObjectId, ref: "Auditorium" },
        readreceipt: { type: Boolean, default: false },
        status: {
            type: String,
            enum: [BookingStatus.APPROVED, BookingStatus.CANCELLED, BookingStatus.PENDING, BookingStatus.REJECTED],
            default: "pending",
        },
        type: { type: String },
        isdeleted: { type: Boolean, default: false },
        createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        modifiedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
