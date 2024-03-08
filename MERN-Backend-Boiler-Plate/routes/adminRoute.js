const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcrypt")
const { adminTokenAuth } = require("../middleware/tokenAuth")
const appConfig = require("../startup/config")
const User = require("../model/user")
const {
    validateAuditoriumCreateReq,
    validateAuditoriumUpdateReq,
    validateAdminUserCreateReq,
    validateAuditoriumDeleteReq,
    validateAdminUserUpdateReq,
    validateAdminUserDeleteReq,
    validateAdminUserCreateBulkReq,
} = require("../validation/auditorium")
const Auditorium = require("../model/auditorium")

router.post("/auditorium", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const reqBody = { ...req.body, createdby: req.userData._id }
        const { error } = validateAuditoriumCreateReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        await Auditorium.create([reqBody], { session })
        await session.commitTransaction()
        return res.json({ error: false, message: "Auditorium created successfully" })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})

router.put("/auditorium/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const reqBody = { ...req.body, modifiedby: req.userData._id }
        const { id } = req.params
        const { error } = validateAuditoriumUpdateReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        let auditoriumData = await Auditorium.findOne({ _id: id, isdeleted: false }).select("_id")
        if (!auditoriumData?._id) return res.status(400).json({ error: true, message: "Auditorium not exist" })
        auditoriumData = await Auditorium.findByIdAndUpdate(id, reqBody, { session })
        await session.commitTransaction()
        return res.json({ data: { auditoriumData }, error: false, message: "Auditorium updated successfully" })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})

router.delete("/auditorium/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const { id } = req.params
        const reqBody = { isdeleted: true, modifiedby: req.userData._id }
        const { error } = validateAuditoriumDeleteReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        let auditoriumData = await Auditorium.findOne({ _id: id, isdeleted: false }).select("_id")
        if (!auditoriumData?._id) return res.status(400).json({ error: true, message: "Auditorium not exist" })
        await Auditorium.findByIdAndUpdate(id, reqBody, { session })
        await session.commitTransaction()
        return res.json({ error: false, message: "Auditorium deleted successfully" })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})

router.post("/faculty/bulk", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        let reqBody = req?.body?.data
        const { error } = validateAdminUserCreateBulkReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        reqBody = reqBody?.map((faculty) => {
            return {
                ...faculty,
                createdby: req.userData._id,
            }
        })
        let errors = []
        await Promise.all(
            reqBody.map(async (user) => {
                let userData = await User.findOne({ email: user.email, isdeleted: false })
                if (userData?._id) return errors.push(user.displayname + " already exist with same email")
                const salt = await bcrypt.genSalt(12)
                const hashedPassword = await bcrypt.hash(appConfig.defaultPassword, salt)
                userData = new User({
                    ...user,
                    password: hashedPassword,
                })
                userData = await userData.save({ session })
            })
        )
        await session.commitTransaction()
        return res.status(errors?.length > 0 ? 400 : 200).json({
            error: errors?.length > 0,
            message: errors?.length > 0 ? errors?.join(", ") : "Faculties added successfully",
        })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})
router.post("/faculty", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()

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
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})

router.put("/faculty/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const reqBody = {
            ...req?.body,
            modifiedby: req.userData._id,
        }
        const { id } = req.params
        const { error } = validateAdminUserUpdateReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        let userData = await User.findOne({ _id: id, isdeleted: false }).select("_id")
        if (!userData?._id) return res.status(400).json({ error: true, message: "User not exist" })
        userData = await User.findByIdAndUpdate(id, reqBody, { session })
        await session.commitTransaction()
        return res.json({
            data: { userData },
            error: false,
            message: "Faculty updated successfully",
        })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})
router.delete("/faculty/:id", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const reqBody = { modifiedby: req.userData._id, isdeleted: true }
        const { id } = req.params
        const { error } = validateAdminUserDeleteReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        let userData = await User.findOne({ _id: id, isdeleted: false }).select("_id")
        if (!userData?._id) return res.status(400).json({ error: true, message: "User not exist" })
        userData = await User.findByIdAndUpdate(id, reqBody, { session })
        await session.commitTransaction()
        return res.json({
            data: { userData },
            error: false,
            message: "Faculty delete successfully",
        })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})

module.exports = router
