const mongoose = require("mongoose")

const auditoriumSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        images: [{ type: String }],
        destination: { block: { type: String }, floor: { type: String } },
        description: { type: String, required: true },
        capacity: { type: Number, required: true },
        features: [{ _id: false, name: { type: String }, description: { type: String } }],
        isdeleted: { type: Boolean, default: false },
        createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        modifiedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const Auditorium = mongoose.model("Auditorium", auditoriumSchema)

module.exports = Auditorium
