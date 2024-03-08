const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
    {
        notification: { type: String, required: true },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        auditorium: { type: mongoose.Schema.Types.ObjectId, ref: "Auditorium" },
        readReceipt: { type: Boolean, default: false },
        status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" },
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
