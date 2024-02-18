const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { isArray } = require("lodash")
const { userTokenAuth } = require("../middleware/tokenAuth")
const Booking = require("../model/booking")
const socket = require("../startup/websocket")
const io = socket.io

router.post("/", userTokenAuth, async (req, res) => {
    const { filter = {}, limit = 10, page = 0 } = req.body
    const userid = req.userData._id
    const conditions = {
        user: userid,
        ...filter,
    }
    let bookings = []
    if (limit === -1) bookings = await Booking.find(conditions)
    else
        bookings = await Booking.find(conditions)
            .skip(page * limit)
            .limit(limit)
    return res.json({ data: { tableData: bookings, tableCount: bookings.length }, error: false })
})

router.put("/create", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { bookings = [] } = req.body
            if (!isArray(bookings)) return res.status(400).json({ error: true, message: "bookings must be an array" })
            const validBookings = []
            let i = 1
            const invalidBookings = []
            bookings.forEach((booking) => {
                const error = false
                // validateBookingCreateReq(booking)
                if (!error) validBookings.push(booking)
                else invalidBookings.push({ ...booking, error })
            })
            await Promise.all(
                bookings.map(async (booking) => {
                    const { auditorium, date, starttime, endtime } = booking
                    const userid = req?.userData?._id
                    if (!auditorium || !date || !starttime || !endtime) {
                        console.log(i++, ": Error: Booking values not found := ", booking)
                        throw new Error("Booking values not found")
                    }
                    const blastBooking = await Booking.findOne({
                        user: userid,
                        auditorium,
                        date,
                        starttime: { $lt: endtime },
                        endtime: { $gt: starttime },
                    }).session(session)
                    if (blastBooking && blastBooking?._id) return console.log(i++, ": Booking already exists")
                    const bookingCreated = await Booking.create(
                        {
                            user: userid,
                            auditorium,
                            date,
                            starttime,
                            endtime,
                        },
                        { session }
                    )
                    if (bookingCreated) {
                        validBookings.push(bookingCreated)
                        io.emit("booking", bookingCreated)
                    } else invalidBookings.push({ ...booking, error: bookingCreated })
                })
            )
            return res.json({ data: { tableData: validBookings, tableCount: validBookings.length }, error: false })
        })
    } catch (error) {
        console.error(error)
        return res.status(400).json({ error: true, message: "Something failed!" })
    } finally {
        mongoose.endSession()
    }
})

router.put("/update", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.withTransaction(async () => {
            const { id, ...updateData } = req.body
            const exists = await Booking.findById(id).session(session)
            if (!exists) return res.status(400).json({ error: true, message: "Booking not found" })
            const bookingUpdated = await Booking.findByIdAndUpdate(id, updateData, { new: true }).session(session)
            return res.json({ error: false, message: bookingUpdated })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        mongoose.endSession()
    }
})

router.delete("/delete", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.withTransaction(async () => {
            const { id } = req.body
            const exists = await Booking.findById(id).session(session)
            if (!exists) return res.status(400).json({ error: true, message: "Booking not found" })
            const bookingDeleted = await Booking.findByIdAndDelete(id).session(session)
            return res.json({ error: false, message: bookingDeleted })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        mongoose.endSession()
    }
})

module.exports = router
