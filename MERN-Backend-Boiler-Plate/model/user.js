const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    rolename: { type: String, enum: ["admin", "faculty", "staff"], default: "faculty", required: true },
    isinvoked: { type: Boolean, default: false },
})

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        displayname: { type: String, required: true },
        email: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 255,
            unique: true,
        },
        phone: Number,
        password: { type: String, required: true, select: false, min: 8, max: 1024 },
        roles: [roleSchema],
        createdby: String,
        modifiedby: String,
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const User = mongoose.model("User", userSchema)

module.exports.User = User
