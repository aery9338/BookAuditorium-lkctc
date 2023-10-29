const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    rolename: { type: String, enum: ["user", "admin", "superadmin"], default: "user", required: true },
    isinvoked: { type: Boolean, default: false },
    expireOn: Date,
})

const addressSchema = new mongoose.Schema({
    addressline1: String,
    addressline2: String,
    city: String,
    state: String,
    country: String,
    zip: String,
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
        dob: String,
        phone: Number,
        password: { type: String, required: true, min: 8, max: 1024 },
        roles: [roleSchema],
        address: addressSchema,
        createdby: String,
        modifiedby: String,
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

const User = mongoose.model("User", userSchema)

module.exports.User = User
