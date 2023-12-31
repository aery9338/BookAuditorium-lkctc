const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcrypt")
const { isArray } = require("lodash")
const { adminTokenAuth } = require("../middleware/tokenAuth")
const appConfig = require("../startup/config")
const { User } = require("../model/user")
const { validateUserCreateReq } = require("../validation/user")

router.post("/user/all", adminTokenAuth, async (req, res) => {
    const { filter = {}, limit = 10, size = 1 } = req.body
    let users = []
    if (limit === -1) users = await User.find(filter)
    users = await User.find(filter)
        .skip(size * limit)
        .limit(limit)
    return res.json({ data: { tableData: users, tableCount: users.length }, error: false })
})

router.post("/create/users", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { users = [] } = req.body
            if (!isArray(users)) return res.json({ error: true, message: "users must be an array" })
            const salt = await bcrypt.genSalt(12)
            const password = bcrypt.hash(appConfig.defaultPassword, salt)
            let i = 1
            const validUserData = []
            const invalidUserData = []
            users.forEach((user) => {
                const error = validateUserCreateReq(user)
                if (!error) validUserData.push(user)
                else invalidUserData.push({ ...user, error })
            })
            await Promise.all(
                users.map(async (user) => {
                    const {
                        username = "",
                        displayname = "",
                        email = "",
                        roles = [{ rolename: "user" }],
                        fathername = "",
                        mothername = "",
                        dob = "",
                        gender = "",
                        registeredDate = new Date().toDateString(),
                    } = user
                    if (!username || !displayname || !email)
                        return console.log(i++, ": Error: User values not found := ", user)

                    const blastUser = await User.findOne({ email }).session(session)
                    if (blastUser && blastUser?._id) return console.log(i++, ": User already exists")
                    const userCreated = await User.create(
                        {
                            username,
                            displayname,
                            email,
                            fathername,
                            mothername,
                            dob,
                            gender,
                            password,
                            roles,
                            registeredDate,
                        },
                        { session }
                    )

                    console.log(i++, ": User created ", userCreated?._id)
                })
            )
            return res.json({ error: false, message: "Users created" })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        session.endSession()
    }
})

module.exports = router
