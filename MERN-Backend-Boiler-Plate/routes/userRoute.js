const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("../model/user")
const router = express.Router()
const { userTokenAuth } = require("../middleware/tokenAuth")
const { validateUserSignUpReq, validateUserLoginReq } = require("../validation/user")
const { createJWToken, createRefreshJWToken } = require("../middleware/helper")

router.get("/me", userTokenAuth, async (req, res) => {
    try {
        const { _id } = req.userData
        let userData = await User.findById(_id)
        if (!userData) return res.status(400).json({ error: true, message: "Doesn't find the users" })
        return res.json({
            data: {
                userData,
                access_token: createJWToken(JSON.parse(JSON.stringify(userData))),
                refresh_token: createRefreshJWToken(JSON.parse(JSON.stringify(userData))),
            },
            error: false,
        })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

router.post("/signup", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const reqBody = { ...req?.body, roles: ["faculty"] }
        const { error } = validateUserSignUpReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        let userData = await User.findOne({ email: req.body.email })
        if (userData) return res.status(400).json({ error: true, message: "User already exist" })
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        userData = new User({ ...reqBody, password: hashedPassword })
        userData = await userData.save({ session })
        await session.commitTransaction()
        return res.json({
            data: {
                userData: userData,
                access_token: createJWToken(JSON.parse(JSON.stringify(userData))),
                refresh_token: createRefreshJWToken(JSON.parse(JSON.stringify(userData))),
            },
            error: false,
            message: "User signup successfully",
        })
    } catch (error) {
        await session.commitTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

router.post("/login", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const { error } = validateUserLoginReq(req?.body)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        const { password, username } = req?.body ?? {}
        let userData = await User.findOne({
            $or: [{ email: username }, { username }],
        }).select("+password")
        if (!userData) return res.status(400).json({ error: true, message: "Invalid credentials" })
        const isvalid = await bcrypt.compare(password, userData.password)
        if (!isvalid) return res.status(400).json({ error: true, message: "Invalid credentials" })
        await session.commitTransaction()
        return res.json({
            data: {
                userData: userData,
                access_token: createJWToken(JSON.parse(JSON.stringify(userData))),
                refresh_token: createRefreshJWToken(JSON.parse(JSON.stringify(userData))),
            },
            error: false,
            message: "Login successfully",
        })
    } catch (error) {
        await session.commitTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

module.exports = router
