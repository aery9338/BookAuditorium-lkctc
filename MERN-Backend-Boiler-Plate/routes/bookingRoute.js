const express = require("express")
const mongoose = require("mongoose")
const winston = require("winston")
const router = express.Router()
const { userTokenAuth, adminTokenAuth } = require("../middleware/tokenAuth")
const Booking = require("../model/booking")
const Notification = require("../model/notification")
const User = require("../model/user")
const { validateBookingCreateReq, validateBookingUpdateReq } = require("../validation/booking")
const { BookingStatus } = require("../utils/constant")
const Auditorium = require("../model/auditorium")
const { compare } = require("../utils/helper")
const { transporter } = require("../startup/nodemailer")
const { domainName } = require("../startup/config")

const getEmailContent = (type, data) => {
    return type === "new-request"
        ? `
        <span>
                Booking request from ${data.requestfrom} is receiced for ${
              data.auditoriumtitle
          } auditorium on ${new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          }).format(new Date(data.bookingdate))} from ${new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          }).format(new Date(data.starttime))} to ${new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          }).format(new Date(data.endtime))} entitled ${data.requesttitle}
        </span>
        <br />
        <br />
        <a
            href="${domainName}/?dashboardTab=requests&requestTab=all&requestId=${data.bookingId}"
            style="
                background-color: #ed7d31;
                color: #feffff;
                align-items: center;
                border-radius: 6px;
                box-shadow: 4px 4px 20px -4px #14132233;
                display: flex;
                height: fit-content;
                justify-content: center;
                letter-spacing: .8px;
                padding: 8px 14px;
                width: fit-content;
                border: none;
                text-align: center;
                text-decoration: none;
                font-size: 16px;
            "
        >
            View Booking
        </a>
        </div>
        `
        : type === "request-response"
        ? `
        <span>
            Booking request from ${data.requestfrom} is ${data.bookingstatus} by ${data.responsefrom} for ${
              data.auditoriumtitle
          } auditorium on ${new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          }).format(new Date(data.bookingdate))} entitled ${data.requesttitle}
        </span>`
        : type === "response-back"
        ? `
        <span>
            Your booking request is ${data.bookingstatus} by ${data.responsefrom} for ${
              data.auditoriumtitle
          } auditorium on ${new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          }).format(new Date(data.bookingdate))} entitled ${data.requesttitle}
        </span>
        `
        : type === "schedule-request"
        ? `
        <span>
        ${data.responsefrom} requested you to join with ${data.requestfrom} in ${
              data.auditoriumtitle
          } auditorium on ${new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          }).format(new Date(data.bookingdate))} from ${new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          }).format(new Date(data.starttime))} to ${new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
          }).format(new Date(data.endtime))}</span>`
        : ""
}

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
        }).select("_id email")
        const audtoriumDetail = await Auditorium.findById(reqBody.auditorium).select("title")
        const newNotifications = await Notification.create(
            adminIds.map((adminId) => {
                return {
                    notification: `Booking request from ${req.userData.displayname} is receiced for ${
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
                    }).format(new Date(reqBody.endtime))} entitled ${reqBody.title}`,
                    to: adminId._id,
                    type: "new-request",
                    booking: booking[0]._id,
                    createdby: req.userData._id,
                    auditorium: reqBody.auditorium,
                }
            }),
            { session }
        )
        try {
            await Promise.all(
                adminIds.map(
                    async ({ email }) =>
                        await transporter.sendMail({
                            to: email,
                            subject: `New request recieved from ${req.userData.displayname}`,
                            text: `Booking request from ${req.userData.displayname} is receiced for ${
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
                            }).format(new Date(reqBody.endtime))} entitled ${reqBody.title}`,
                            html: getEmailContent("new-request", {
                                requestfrom: req.userData.displayname,
                                auditoriumtitle: audtoriumDetail.title,
                                bookingdate: reqBody.bookingdate,
                                starttime: reqBody.starttime,
                                endtime: reqBody.endtime,
                                requesttitle: reqBody.title,
                                bookingId: booking[0]._id,
                            }),
                        })
                )
            )
        } catch (error) {
            winston.info(error)
        }
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
        const { _id: userId, displayname: userDisplayname } = req.userData
        const { bookingstatus } = req.body
        const { error } = validateBookingUpdateReq({ bookingstatus })
        if (error) return res.status(400).json({ error: true, message: error.details[0].message })
        const existingBooking = await Booking.findOne({ _id: id, isdeleted: false }).populate(
            "createdby auditorium staff"
        )
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
                return res.status(400).json({ error: true, message: "Other Request is alerady in this time range." })
        }
        const bookingUpdated = await Booking.findByIdAndUpdate(id, { bookingstatus }, { session })
        await Notification.updateMany({ isdeleted: false, booking: id }, { status: bookingstatus })
        const adminIds = await User.find({
            roles: { $in: ["admin", "superadmin"] },
            isdeleted: false,
        }).select("_id email")
        const newNotifications = await Notification.create(
            [
                ...adminIds.flatMap(({ _id: adminId }) => {
                    if (compare(adminId.toString(), userId)) return []
                    return {
                        notification: `Booking request from ${
                            existingBooking.createdby.displayname
                        } is ${bookingstatus} by ${userDisplayname} for ${
                            existingBooking.auditorium.title
                        } auditorium on ${new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }).format(new Date(existingBooking.bookingdate))} entitled ${existingBooking.title}`,
                        to: adminId,
                        type: "response-request",
                        status: bookingstatus,
                        booking: id,
                        createdby: userId,
                        auditorium: existingBooking.auditorium._id,
                    }
                }),
                {
                    notification: `Your booking request is ${bookingstatus} by ${userDisplayname} for ${
                        existingBooking.auditorium.title
                    } auditorium on ${new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }).format(new Date(existingBooking.bookingdate))} entitled ${existingBooking.title}`,
                    to: existingBooking.createdby._id,
                    type: "response-request",
                    status: bookingstatus,
                    booking: id,
                    createdby: userId,
                    auditorium: existingBooking.auditorium._id,
                },
                ...(bookingstatus === BookingStatus.APPROVED
                    ? existingBooking.staff.map(({ _id }) => {
                          return {
                              notification: `${userDisplayname} requested you to join with ${
                                  existingBooking.createdby.displayname
                              } in ${existingBooking.auditorium.title} auditorium on ${new Intl.DateTimeFormat(
                                  "en-GB",
                                  {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  }
                              ).format(new Date(existingBooking.bookingdate))} from ${new Intl.DateTimeFormat("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              }).format(new Date(existingBooking.starttime))} to ${new Intl.DateTimeFormat("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              }).format(new Date(existingBooking.endtime))}`,
                              to: _id,
                              type: "schedule-request",
                              status: bookingstatus,
                              booking: id,
                              createdby: userId,
                              auditorium: existingBooking.auditorium._id,
                          }
                      })
                    : []),
            ],
            { session }
        )
        try {
            await Promise.all([
                ...adminIds.map(async ({ _id, email }) => {
                    if (!compare(_id.toString(), userId))
                        await transporter.sendMail({
                            to: email,
                            subject: `${existingBooking.title} request is ${bookingstatus} by ${userDisplayname}`,
                            text: `Booking request from ${
                                existingBooking.createdby.displayname
                            } is ${bookingstatus} by ${userDisplayname} for ${
                                existingBooking.auditorium.title
                            } auditorium on ${new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }).format(new Date(existingBooking.bookingdate))} entitled ${existingBooking.title}`,
                            html: getEmailContent("request-response", {
                                requestfrom: existingBooking.createdby.displayname,
                                responsefrom: userDisplayname,
                                bookingstatus: bookingstatus,
                                auditoriumtitle: existingBooking.auditorium.title,
                                bookingdate: existingBooking.bookingdate,
                                requesttitle: existingBooking.title,
                            }),
                        })
                }),
                await transporter.sendMail({
                    to: existingBooking.createdby.email,
                    subject: `Your request is ${bookingstatus} by ${userDisplayname}`,
                    text: `Your booking request is ${bookingstatus} by ${userDisplayname} for ${
                        existingBooking.auditorium.title
                    } auditorium on ${new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }).format(new Date(existingBooking.bookingdate))} entitled ${existingBooking.title}`,
                    html: getEmailContent("response-back", {
                        responsefrom: userDisplayname,
                        bookingstatus: bookingstatus,
                        auditoriumtitle: existingBooking.auditorium.title,
                        bookingdate: existingBooking.bookingdate,
                        requesttitle: existingBooking.title,
                    }),
                }),
                ...(bookingstatus === BookingStatus.APPROVED
                    ? existingBooking.staff.map(async ({ email }) => {
                          await transporter.sendMail({
                              to: email,
                              subject: `Request you to join ${
                                  existingBooking.auditorium.title
                              } on ${new Intl.DateTimeFormat("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                              }).format(new Date(existingBooking.bookingdate))}`,
                              text: `${userDisplayname} requested you to join with ${
                                  existingBooking.createdby.displayname
                              } in ${existingBooking.auditorium.title} auditorium on ${new Intl.DateTimeFormat(
                                  "en-GB",
                                  {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                  }
                              ).format(new Date(existingBooking.bookingdate))} from ${new Intl.DateTimeFormat("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              }).format(new Date(existingBooking.starttime))} to ${new Intl.DateTimeFormat("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              }).format(new Date(existingBooking.endtime))}`,
                              html: getEmailContent("schedule-request", {
                                  responsefrom: userDisplayname,
                                  requestfrom: existingBooking.createdby.displayname,
                                  bookingdate: existingBooking.bookingdate,
                                  starttime: existingBooking.starttime,
                                  endtime: existingBooking.endtime,
                                  auditoriumtitle: existingBooking.auditorium.title,
                              }),
                          })
                      })
                    : []),
            ])
        } catch (error) {
            winston.info(error)
        }
        const io = await req.app.get("io")
        newNotifications.forEach((notification) => {
            io.emit(`notification-${notification.to.toString()}`, {
                message: "Booking request is " + notification.status,
                description: notification.notification,
                type: notification.type,
            })
        })
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
        const updatedNotifications = await Notification.updateMany(
            { isdeleted: false, booking: id },
            { isdeleted: true, status: BookingStatus.CANCELLED, type: "delete-request" }
        )
        const io = await req.app.get("io")
        updatedNotifications.forEach((notification) => {
            io.emit(`notification-${notification.to.toString()}`, {
                message: "Request deleted",
                type: "delete-request",
            })
        })
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
