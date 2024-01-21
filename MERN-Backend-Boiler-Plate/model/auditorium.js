const mongoose = require("mongoose")

const destinationSchema = new mongoose.Schema({
    block: { type: String },
    floor: { type: String },
    name: { type: String, required: true, unique: true },
})
const featureSchema = new mongoose.Schema({
    name: { type: String, enum: ["TV", "Mic", "Projector"] },
    description: { type: String },
})

const auditoriumSchema = new mongoose.Schema(
    {
        tittle: { type: String, required: true, unique: true },
        image: { type: String },
        destination: destinationSchema,
        description: { type: String, required: true },
        capacity: { type: Number, required: true },
        features: [featureSchema],
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const Auditorium = mongoose.model("Auditorium", auditoriumSchema)

module.exports = Auditorium
