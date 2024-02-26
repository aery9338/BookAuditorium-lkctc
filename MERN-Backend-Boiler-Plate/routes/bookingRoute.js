const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { userTokenAuth, adminTokenAuth } = require("../middleware/tokenAuth")
const Booking = require("../model/booking")
const { validateBookingCreateReq } = require("../validation/booking")

router.get("/", userTokenAuth, async (req, res) => {
    try {
        const { filter = {}, limit = -1, page = 0 } = req.query
        const createdby = req.userData._id
        const conditions = {
            isdeleted: false,
            createdby,
            ...filter,
        }
        let bookings = []
        if (limit === -1) bookings = await Booking.find(conditions).populate("auditorium staff")
        else
            bookings = await Booking.find(conditions)
                .skip(page * limit)
                .limit(limit)
        return res.json({ data: { data: bookings, totalCount: bookings.length } })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

router.get("/requests", adminTokenAuth, async (req, res) => {
    try {
        const { filter = {}, limit = -1, page = 0 } = req.query
        const userId = req.userData._id
        const conditions = {
            user: userId,
            isdeleted: false,
            ...filter,
        }
        let bookings = []
        if (limit === -1) bookings = await Booking.find(conditions)
        else
            bookings = await Booking.find(conditions)
                .skip(page * limit)
                .limit(limit)
        return res.json({ data: { data: bookings, totalCount: bookings.length } })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

router.post("/", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const reqBody = { ...req.body, createdby: req.userData._id }
            const { error } = validateBookingCreateReq(reqBody)
            if (error) return res.status(400).json({ error: true, message: error.details[0].message })
            const booking = await Booking.create([reqBody], { session })
            return res.json({ data: booking, message: "Booking request received, Wait for admin response" })
        })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

router.put("/:id", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.withTransaction(async () => {
            const { id } = req.params
            const reqBody = req.body
            const exists = await Booking.findById(id)
            if (!exists) return res.status(400).json({ error: true, message: "Request not found" })
            const bookingUpdated = await Booking.findByIdAndUpdate(id, { reqBody }).session(session)
            return res.json({ data: bookingUpdated, message: "Request is updated" })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        session.endSession()
    }
})

router.delete("/:id", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.withTransaction(async () => {
            const { id } = req.params
            const exists = await Booking.findById(id)
            if (!exists) return res.status(400).json({ error: true, message: "Request not found" })
            const bookingDeleted = await Booking.findByIdAndUpdate(id, {
                isdeleted: true,
                modifiedby: req.userData._id,
            }).session(session)
            return res.json({ data: bookingDeleted, message: "Request is deleted" })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        session.endSession()
    }
})

module.exports = router
