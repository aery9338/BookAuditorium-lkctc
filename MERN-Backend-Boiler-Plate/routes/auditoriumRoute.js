const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { isArray } = require("lodash")
const { adminTokenAuth } = require("../middleware/tokenAuth")
const Auditorium = require("../model/auditorium")
const { validateAuditoriumCreateReq, validateAuditoriumUpdateReq } = require("../validation/auditorium")

router.post("/all", async (req, res) => {
    const { filter = {}, limit = 10, page = 0 } = req.body
    let auditoriums = []
    if (limit === -1) auditoriums = await Auditorium.find(filter)
    else
        auditoriums = await Auditorium.find(filter)
            .skip(page * limit)
            .limit(limit)
    return res.json({ data: { tableData: auditoriums, tableCount: auditoriums.length }, error: false })
})

router.post("/create", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { auditoriums = [] } = req.body
            if (!isArray(auditoriums)) return res.json({ error: true, message: "auditoriums must be an array" })
            const validAuditoriums = []
            let i = 1
            const invalidAuditoriums = []
            auditoriums.forEach((auditorium) => {
                const error = validateAuditoriumCreateReq(auditorium)
                if (!error) validAuditoriums.push(auditorium)
                else invalidAuditoriums.push({ ...auditorium, error })
            })
            await Promise.all(
                auditoriums.map(async (auditorium) => {
                    const {
                        tittle = "",
                        image = "",
                        destination = {},
                        description = "",
                        capacity = 0,
                        features = [],
                    } = auditorium
                    if (!tittle || !destination || !description || !capacity) {
                        console.log(i++, ": Error: Auditorium values not found := ", auditorium)
                        throw new Error("Auditorium values not found")
                    }

                    const blastAuditorium = await Auditorium.findOne({ tittle }).session(session)
                    if (blastAuditorium && blastAuditorium?._id) return console.log(i++, ": Auditorium already exists")
                    const auditoriumCreated = await Auditorium.create(
                        {
                            tittle,
                            image,
                            destination,
                            description,
                            capacity,
                            features,
                        },
                        { session }
                    )
                    console.log(i++, ": Auditorium created := ", auditoriumCreated)
                })
            )
            return res.json({ error: false, message: "auditoriums created" })
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: true, message: "something went wrong" })
    } finally {
        session.endSession()
    }
})

router.put("/update", async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id, ...updateData } = req.body
            if (!id) return res.json({ error: true, message: "id not found" })
            const error = validateAuditoriumUpdateReq(updateData)
            if (error) {
                console.error(error)
                return res.json({ error: true, message: "error occures in validation" })
            }
            const auditorium = await Auditorium.findById(id).session(session)
            if (!auditorium) return res.json({ error: true, message: "Auditorium not found" })
            const auditoriumUpdated = await Auditorium.findByIdAndUpdate(id, updateData, { new: true })
            return res.json({ data: auditoriumUpdated, error: false })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "something failed" })
    } finally {
        session.endSession()
    }
})

router.delete("/delete", adminTokenAuth, async (req, res) => {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const { id } = req.body
            const auditorium = await Auditorium.findById(id).session(session)
            if (!auditorium) return res.json({ error: true, message: "Auditorium not found" })
            const auditoriumDeleted = await Auditorium.findByIdAndDelete(id)
            return res.json({ data: auditoriumDeleted, error: false })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: true, message: "something failed" })
    } finally {
        session.endSession()
    }
})

module.exports = router
