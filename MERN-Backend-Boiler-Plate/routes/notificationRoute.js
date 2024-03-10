const express = require("express")
const Notification = require("../model/notification")
const { userTokenAuth } = require("../middleware/tokenAuth")
const { default: mongoose } = require("mongoose")
const router = express.Router()

router.get("/", userTokenAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({
            isdeleted: false,
            to: new mongoose.Types.ObjectId(req.userData._id),
        })
            .populate({
                path: "createdby",
                select: "_id displayname email",
            })
            .populate({
                path: "booking",
                populate: {
                    path: "createdby",
                    select: "_id displayname email",
                },
            })
            .populate("auditorium")
            .sort({ createdon: -1 })
        const unreadNotifications = await Notification.countDocuments({
            isdeleted: false,
            to: new mongoose.Types.ObjectId(req.userData._id),
            readreceipt: false,
        })
        const result = { notifications, unreadNotifications }
        return res.json({ data: result })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

router.get("/read-all", userTokenAuth, async (req, res) => {
    try {
        await Notification.updateMany(
            { isdeleted: false, to: new mongoose.Types.ObjectId(req.userData._id) },
            { readreceipt: true }
        )
        return res.json({ message: "Notification readed successfully" })
    } catch (error) {
        return res.status(400).json({ error: true, message: `Something failed: ${error}` })
    }
})

module.exports = router
