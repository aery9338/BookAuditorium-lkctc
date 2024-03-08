const mongoose = require("mongoose")

const rolesEnum = ["faculty", "staff", "admin", "superadmin"]
const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, sparse: true },
        displayname: { type: String, required: true },
        email: { type: String, required: true, minLength: 5, maxLength: 255, unique: true },
        password: { type: String, required: true, select: false, min: 8, max: 1024 },
        roles: { type: [String], required: true, default: ["faculty"], enum: rolesEnum },
        isdeleted: { type: Boolean, default: false },
        createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        modifiedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: { createdAt: "createdon", updatedAt: "modifiedon" },
    }
)

userSchema.pre("save", async function (next) {
    const existingUser = await this.constructor.findOne({ email: this.email, isdeleted: true })
    if (existingUser) await this.constructor.deleteOne({ _id: existingUser._id })
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User
