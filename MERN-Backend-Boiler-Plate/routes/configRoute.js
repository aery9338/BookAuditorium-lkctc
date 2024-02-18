const express = require("express")
const Auditorium = require("../model/auditorium")
const { User } = require("../model/user")
const { userTokenAuth } = require("../middleware/tokenAuth")
const { isAuthorized } = require("../utils/helper")
const router = express.Router()

router.get("/", userTokenAuth, async (req, res) => {
    let data = {}
    const auditoriums = await Auditorium.aggregate([
        {
            $match: {
                isdeleted: false,
            },
        },
        {
            $addFields: {
                key: "$_id",
            },
        },
    ])
    data.auditoriums = auditoriums
    if (isAuthorized(req.userData.roles, ["admin", "superadmin"])) {
        const faculties = await User.aggregate([
            {
                $match: {
                    roles: {
                        $not: {
                            $elemMatch: { $eq: "superadmin" },
                        },
                    },
                    isdeleted: false,
                },
            },
            {
                $addFields: {
                    key: "$_id",
                },
            },
        ])
        data.faculties = faculties
    }
    return res.json({ error: false, data })
})

module.exports = router
