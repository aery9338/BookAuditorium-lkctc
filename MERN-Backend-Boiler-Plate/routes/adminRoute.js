const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcrypt")
const { adminTokenAuth } = require("../middleware/tokenAuth")
const appConfig = require("../startup/config")
const { User } = require("../model/user")
const {
    validateAuditoriumCreateReq,
    validateAuditoriumUpdateReq,
    validateAdminUserCreateReq,
    validateAuditoriumDeleteReq,
    validateAdminUserUpdateReq,
    validateAdminUserDeleteReq,
} = require("../validation/auditorium")
const Auditorium = require("../model/auditorium")

router.get("/", adminTokenAuth, async (req, res) => {
    return res.json({ data: { adminData: {} }, error: false })
})

router.post("/auditorium", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = { ...req.body, createdby: req.userData._id }
            const { error } = validateAuditoriumCreateReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            await Auditorium.create([reqBody], { session })
            await session.commitTransaction()
            return res.json({ error: false, message: "Auditorium created successfully" })
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: true, message: "something went wrong" })
    } finally {
        session.endSession()
    }
})

router.put("/auditorium/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = { ...req.body, modifiedby: req.userData._id }
            const { id } = req.params
            const { error } = validateAuditoriumUpdateReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            let auditoriumData = await Auditorium.findById(id).select({ isdeleted: false })
            if (!auditoriumData) return res.status(400).json({ error: true, message: "Auditorium not exist" })
            auditoriumData = await Auditorium.findByIdAndUpdate(id, reqBody, { session })
            await session.commitTransaction()
            return res.json({ data: { auditoriumData }, error: false, message: "Auditorium updated successfully" })
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: true, message: "something went wrong" })
    } finally {
        session.endSession()
    }
})

router.delete("/auditorium/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id } = req.params
            const reqBody = { isdeleted: true, modifiedby: req.userData._id }
            const { error } = validateAuditoriumDeleteReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            await Auditorium.findByIdAndUpdate(id, reqBody, { session })
            await session.commitTransaction()
            return res.json({ error: false, message: "Auditorium deleted successfully" })
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: true, message: "something went wrong" })
    } finally {
        session.endSession()
    }
})

router.post("/faculty", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = {
                ...req?.body,
                createdby: req.userData._id,
            }
            const { error } = validateAdminUserCreateReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            let userData = await User.findOne({ email: req.body.email })
            if (userData) return res.status(400).json({ error: true, message: "User already exist with same email" })
            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(appConfig.defaultPassword, salt)
            userData = new User({
                ...reqBody,
                password: hashedPassword,
            })
            userData = await userData.save({ session })
            await session.commitTransaction()
            return res.json({
                data: { userData },
                error: false,
                message: "Added new faculty member",
            })
        })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

router.put("/faculty/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = {
                ...req?.body,
                modifiedby: req.userData._id,
            }
            const { id } = req.params
            const { error } = validateAdminUserUpdateReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            let userData = await User.findById(id).select({ isdeleted: false })
            if (!userData) return res.status(400).json({ error: true, message: "User not exist" })
            userData = await User.findByIdAndUpdate(id, reqBody, { session })
            await session.commitTransaction()
            return res.json({
                data: { userData },
                error: false,
                message: "Faculty updated successfully",
            })
        })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})
router.delete("/faculty/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = { modifiedby: req.userData._id, isdeleted: true }
            const { id } = req.params
            const { error } = validateAdminUserDeleteReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            let userData = await User.findById(id).select({ isdeleted: false })
            if (!userData) return res.status(400).json({ error: true, message: "User not exist" })
            userData = await User.findByIdAndUpdate(id, reqBody, { session })
            await session.commitTransaction()
            return res.json({
                data: { userData },
                error: false,
                message: "Faculty delete successfully",
            })
        })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

module.exports = router
