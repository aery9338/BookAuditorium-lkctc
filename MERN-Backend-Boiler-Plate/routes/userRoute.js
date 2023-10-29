const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const router = express.Router()
const { userTokenAuth } = require("../middleware/tokenAuth")
const { validateUserSignUpReq, validateUserLoginReq } = require("../validation/user")
const { User } = require("../model/user")
const { createJWToken, createRefreshJWToken } = require("../middleware/helper")
const _ = require("lodash")

router.get("/me", userTokenAuth, async (req, res) => {
    const { id } = req.user
    const user = User.findById(id)
    if (!user) return res.json({ message: "Doesn't find the users", error: true })
    return res.json({
        data: { userData: _.pick(user, ["_id", "username", "displayName", "email", "role"]) },
        error: false,
    })
})

router.get("/check_username", async (req, res) => {
    const { username } = req.query
    const user = await User.findOne({ username })
    if (!user) return res.json({ message: "username is availble", success: true })
    else
        return res.json({
            message: "username is already in use",
            error: true,
        })
})

router.post("/signup", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = {
                ...req?.body,
                roles: [],
                createdby: "self",
                modifiedby: "self",
            }
            const { error } = validateUserSignUpReq(reqBody)
            if (error) return res.json({ message: error.details[0].message, error: true })
            let user = await User.findOne({
                email: req.body.email,
            })
            if (user) return res.json({ message: "User already exist", error: true })
            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user = new User({
                ...reqBody,
                password: hashedPassword,
            })
            user = await user.save({ session })
            user = _.pick(user, ["_id", "displayname", "username", "roles", "email"])
            await session.commitTransaction()
            return res.json({
                data: { ...user, access_token: createJWToken(user), refresh_token: createRefreshJWToken(user) },
                error: false,
                message: "User signup successfully",
            })
        })
    } catch (error) {
        return res.json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

router.post("/login", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { error } = validateUserLoginReq(req?.body)
            if (error) return res.json({ message: error.details[0].message, error: true })
            const { password, username } = req?.body ?? {}
            let user = await User.findOne({
                $or: [{ email: username }, { username }],
            })
            if (!user) return res.json({ message: "Invalid credentials", error: true })
            const isvalid = await bcrypt.compare(password, user.password)
            if (!isvalid) return res.json({ message: "Invalid credentials", error: true })
            user = _.pick(user, ["_id", "displayname", "username", "roles", "email"])
            await session.commitTransaction()
            return res.json({
                data: { ...user, access_token: createJWToken(user), refresh_token: createRefreshJWToken(user) },
                error: false,
                message: "Login successfully",
            })
        })
    } catch (error) {
        return res.json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

module.exports = router
