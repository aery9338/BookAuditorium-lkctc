const express = require("express")
const Notification = require("../model/notification")
const { userTokenAuth } = require("../middleware/tokenAuth")
const { default: mongoose } = require("mongoose")
const router = express.Router()

router.get("/", userTokenAuth, async (req, res) => {
    try {
        let result = await Notification.aggregate([
            {
                $match: {
                    isdeleted: false,
                    to: new mongoose.Types.ObjectId(req.userData._id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdby",
                    foreignField: "_id",
                    as: "createdby",
                },
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "booking",
                    foreignField: "_id",
                    as: "booking",
                },
            },
            {
                $lookup: {
                    from: "auditoria",
                    localField: "auditorium",
                    foreignField: "_id",
                    as: "auditorium",
                },
            },
            {
                $unwind: "$createdby",
            },
            {
                $unwind: "$booking",
            },
            {
                $unwind: "$auditorium",
            },
            {
                $sort: {
                    "notifications.createdon": -1,
                },
            },
            {
                $group: {
                    _id: null,
                    notifications: { $push: "$$ROOT" },
                    unreadNotifications: { $sum: { $cond: [{ $eq: ["$readReceipt", false] }, 1, 0] } },
                },
            },
            {
                $project: {
                    createdby: {
                        _id: "$createdby._id",
                        displayname: "$createdby.displayname",
                        email: "$createdby.email",
                    },
                    auditorium: {
                        title: "$auditorium.title",
                    },
                    booking: {
                        enddate: "$booking.enddate",
                        startdate: "$booking.startdate",
                        bookingstatus: "$booking.bookingstatus",
                        bookingdate: "$booking.bookingdate",
                    },
                    notifications: "$notifications",
                    unreadNotifications: "$unreadNotifications",
                },
            },
            {
                $project: {
                    _id: 0,
                    notifications: {
                        $map: {
                            input: "$notifications",
                            as: "notification",
                            in: {
                                $mergeObjects: [
                                    "$$notification",
                                    {
                                        createdby: "$$notification.createdby",
                                        auditorium: "$$notification.auditorium",
                                        booking: "$$notification.booking",
                                    },
                                ],
                            },
                        },
                    },
                    unreadNotifications: "$unreadNotifications",
                },
            },
        ])
        result = result.length ? result[0] : { notifications: [], unreadNotifications: 0 }
        return res.json({ data: result })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

module.exports = router
