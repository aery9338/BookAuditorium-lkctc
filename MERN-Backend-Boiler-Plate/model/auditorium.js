const mongoose = require("mongoose")

const auditoriumSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        images: [{ type: String }],
        destination: {
            block: { type: String },
            floor: { type: String },
            name: { type: String, required: true, unique: true },
        },
        description: { type: String, required: true },
        capacity: { type: Number, required: true },
        features: [
            {
                name: { type: String, enum: ["TV", "Smart Tv", "Mic", "Projector"] },
                description: { type: String },
            },
        ],
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const Auditorium = mongoose.model("Auditorium", auditoriumSchema)

module.exports = Auditorium
