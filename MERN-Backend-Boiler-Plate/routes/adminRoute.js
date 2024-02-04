const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcrypt")
const { isArray } = require("lodash")
const { adminTokenAuth } = require("../middleware/tokenAuth")
const appConfig = require("../startup/config")
const { User } = require("../model/user")
const { validateUserCreateReq, validateUserUpdateReq, validateUserRoleUpdateReq } = require("../validation/user")
const { validateAuditoriumCreateReq, validateAuditoriumUpdateReq } = require("../validation/auditorium")
const Auditorium = require("../model/auditorium")

router.get("/", adminTokenAuth, async (req, res) => {
    return res.json({ data: { adminData: {} }, error: false })
})

router.post("/user/all", adminTokenAuth, async (req, res) => {
    const { filter = {}, limit = 10, page = 0 } = req.body
    let users = []
    if (limit === -1) users = await User.find(filter)
    users = await User.find(filter)
        .skip(page * limit)
        .limit(limit)
    return res.json({ data: { tableData: users, tableCount: users.length }, error: false })
})

router.post("/create/users", adminTokenAuth, async (req, res) => {
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
                    if (!username || !displayname || !email) {
                        console.log(i++, ": Error: User values not found := ", user)
                        throw new Error("User values not found")
                    }
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

router.put("/update/user", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id, ...updateData } = req.body
            const error = validateUserUpdateReq(updateData)
            if (error) {
                return res.json({ error: true, message: error })
            }
            const exists = await User.findById(id).session(session)
            if (exists) {
                const user = await User.findByIdAndUpdate(id, updateData, { new: true })
                return res.json({ data: user, error: false })
            } else {
                return res.json({ error: true, message: "User not found" })
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        session.endSession()
    }
})

router.put("/update/userrole", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id, role } = req.body
            const error = validateUserRoleUpdateReq(role)
            if (error) return res.json({ error: true, message: role })
            const exists = await User.findById(id).session(session)
            if (exists) {
                const user = await User.findByIdAndUpdate(id, { roles: role }, { new: true })
                return res.json({ data: user, error: false })
            } else {
                return res.json({ error: true, message: "User Not Found" })
            }
        })
    } catch (error) {
        console.error(error)
        return res.json({ error: true, message: "Something failed" })
    } finally {
        session.endSession()
    }
})

router.delete("/delete/user", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id } = req.body
            const exists = await User.findById(id).session(session)
            if (exists) {
                const user = await User.findByIdAndDelete(id)
                return res.json({ data: user, error: false })
            } else {
                return res.json({ error: true, message: "user not found" })
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "Something failed!" })
    } finally {
        session.endSession()
    }
})

router.post("/auditorium", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const auditorium = req.body
            const { error } = validateAuditoriumCreateReq(auditorium)
            if (error) return res.json({ message: error.details[0].message, error: true })
            await Auditorium.create([auditorium], { session })
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

router.put("/auditorium/:id", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const auditorium = req.body
            const { id } = req.params
            const { error } = validateAuditoriumUpdateReq(auditorium)
            if (error) return res.json({ message: error.details[0].message, error: true })
            await Auditorium.findByIdAndUpdate(id, auditorium, { session })
            await session.commitTransaction()
            return res.json({ error: false, message: "Auditorium updated successfully" })
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: true, message: "something went wrong" })
    } finally {
        session.endSession()
    }
})

router.delete("/auditorium/:id", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id } = req.params
            await Auditorium.findByIdAndUpdate(id, { isdeleted: true }, { session })
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

module.exports = router
