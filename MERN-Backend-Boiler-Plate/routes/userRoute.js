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
    const { _id } = req.userData
    let userData = await User.findById(_id)
    if (!userData) return res.json({ message: "Doesn't find the users", error: true })
    userData = _.pick(userData, ["_id", "displayname", "username", "roles", "email"])
    return res.json({
        data: { userData },
        error: false,
    })
})

router.get("/check_username", async (req, res) => {
    const { username } = req.query
    const userData = await User.findOne({ username })
    if (!userData) return res.json({ message: "username is availble", success: true })
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
                roles: [{ rolename: "faculty" }],
                createdby: "self",
                modifiedby: "self",
            }
            const { error } = validateUserSignUpReq(reqBody)
            if (error) return res.json({ message: error.details[0].message, error: true })
            let userData = await User.findOne({
                email: req.body.email,
            })
            if (userData) return res.json({ message: "User already exist", error: true })
            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            userData = new User({
                ...reqBody,
                password: hashedPassword,
            })
            userData = await userData.save({ session })
            userData = _.pick(userData, ["_id", "displayname", "username", "roles", "email"])
            await session.commitTransaction()
            return res.json({
                data: {
                    userData: userData,
                    access_token: createJWToken(userData),
                    refresh_token: createRefreshJWToken(userData),
                },
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
            let userData = await User.findOne({
                $or: [{ email: username }, { username }],
            }).select("+password")
            if (!userData) return res.json({ message: "Invalid credentials", error: true })
            const isvalid = await bcrypt.compare(password, userData.password)
            if (!isvalid) return res.json({ message: "Invalid credentials", error: true })
            userData = _.pick(userData, ["_id", "displayname", "username", "roles", "email"])
            await session.commitTransaction()
            return res.json({
                data: {
                    userData: userData,
                    access_token: createJWToken(userData),
                    refresh_token: createRefreshJWToken(userData),
                },
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
