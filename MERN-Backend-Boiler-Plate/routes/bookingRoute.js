const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { userTokenAuth, adminTokenAuth } = require("../middleware/tokenAuth")
const Booking = require("../model/booking")
const Notification = require("../model/notification")
const User = require("../model/user")
const { validateBookingCreateReq, validateBookingUpdateReq } = require("../validation/booking")
const { BookingStatus } = require("../utils/constant")
const Auditorium = require("../model/auditorium")

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
        if (limit === -1)
            bookings = await Booking.find(conditions).populate("auditorium staff").sort({ bookingdate: -1 })
        else
            bookings = await Booking.find(conditions)
                .skip(page * limit)
                .limit(limit)
        return res.json({ data: { data: bookings, totalCount: bookings.length } })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

router.get("/events", userTokenAuth, async (req, res) => {
    try {
        const { filter = {}, limit = -1, page = 0 } = req.query
        const conditions = {
            isdeleted: false,
            // bookingstatus: { $eq: BookingStatus.APPROVED },
            staff: req.userData._id,
            ...filter,
        }
        let bookings = []
        if (limit === -1)
            bookings = await Booking.find(conditions).populate("auditorium staff").sort({ bookingdate: -1 })
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
        const conditions = {
            isdeleted: false,
            bookingstatus: { $ne: BookingStatus.CANCELLED },
            ...filter,
        }
        let bookings = []
        if (limit === -1)
            bookings = await Booking.find(conditions).populate("auditorium staff createdby").sort({ bookingdate: -1 })
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
        await session.startTransaction()
        const reqBody = { ...req.body, createdby: req.userData._id }
        const { error } = validateBookingCreateReq(reqBody)
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        const booking = await Booking.create([reqBody], { session })
        const adminIds = await User.find({
            roles: { $in: ["admin", "superadmin"] },
            isdeleted: false,
        }).select("_id")
        const audtoriumDetail = await Auditorium.findById(reqBody.auditorium).select("title")
        const newNotifications = await Notification.create(
            adminIds.map((adminId) => {
                return {
                    notification: `Booking Request from ${req.userData.displayname} is receiced for ${
                        audtoriumDetail.title
                    } auditorium on ${new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }).format(new Date(reqBody.bookingdate))} from ${new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }).format(new Date(reqBody.starttime))} to ${new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }).format(new Date(reqBody.endtime))}`,
                    to: adminId._id,
                    type: "new-request",
                    booking: booking[0]._id,
                    createdby: req.userData._id,
                    auditorium: reqBody.auditorium,
                }
            }),
            { session }
        )
        const io = await req.app.get("io")
        newNotifications.forEach((notification) => {
            io.emit(`notification-${notification.to.toString()}`, {
                message: "New Booking request",
                description: notification.notification,
                type: notification.type,
            })
        })
        await session.commitTransaction()
        return res.json({ data: booking, message: "Booking request received, Wait for admin response" })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        await session.endSession()
    }
})

router.put("/:id", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const { id } = req.params
        const { bookingstatus } = req.body
        const { error } = validateBookingUpdateReq({ bookingstatus })
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        const existingBooking = await Booking.findOne({ _id: id, isdeleted: false })
        if (!existingBooking) return res.status(400).json({ error: true, message: "Request not found" })
        if (bookingstatus === BookingStatus.APPROVED) {
            const otherRequestExist = await Booking.findOne({
                _id: { $ne: id },
                auditorium: existingBooking.auditorium,
                bookingstatus: BookingStatus.APPROVED,
                bookingdate: existingBooking.bookingdate,
                $nor: [
                    {
                        $and: [
                            { startTime: { $gte: existingBooking.starttime } },
                            { endTime: { $lte: existingBooking.endtime } },
                        ],
                    },
                    {
                        $and: [
                            { startTime: { $lte: existingBooking.starttime } },
                            { endTime: { $gt: existingBooking.starttime } },
                        ],
                    },
                    {
                        $and: [
                            { startTime: { $lt: existingBooking.endtime } },
                            { endTime: { $gte: existingBooking.endtime } },
                        ],
                    },
                ],
            })
            if (otherRequestExist)
                return res.status(400).json({ error: true, message: "Other Request is alerady  in this time range." })
        }
        const bookingUpdated = await Booking.findByIdAndUpdate(id, { bookingstatus }, { session })
        await session.commitTransaction()
        return res.json({ data: bookingUpdated, message: "Request is " + bookingstatus })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

router.delete("/:id", userTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const { id } = req.params
        let bookingData = await Booking.findOne({ _id: id, isdeleted: false }).select("_id")
        if (!bookingData?._id) return res.status(400).json({ error: true, message: "Request not exist" })
        const bookingDeleted = await Booking.findByIdAndUpdate(
            id,
            {
                bookingstatus: BookingStatus.CANCELLED,
                modifiedby: req.userData._id,
            },
            { session }
        )
        await session.commitTransaction()
        return res.json({ data: bookingDeleted, message: "Your request has been cancelled" })
    } catch (error) {
        await session.abortTransaction()
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    } finally {
        session.endSession()
    }
})

module.exports = router
