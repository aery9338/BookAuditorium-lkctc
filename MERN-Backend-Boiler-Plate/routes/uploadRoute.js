const express = require("express")
const router = express.Router()

const { upload } = require("../middleware/multer")
const { getStorage, ref, uploadBytesResumable } = require("firebase/storage")

async function uploadImage(file, quantity) {
    const storageFB = getStorage()

    if (quantity === "single") {
        const dateTime = Date.now()
        const fileName = `images/${dateTime}`
        const storageRef = ref(storageFB, fileName)
        const metadata = {
            contentType: file.type,
        }
        await uploadBytesResumable(storageRef, file.buffer, metadata)
        return fileName
    }

    if (quantity === "multiple") {
        for (let i = 0; i < file.images.length; i++) {
            const dateTime = Date.now()
            const fileName = `images/${dateTime}`
            const storageRef = ref(storageFB, fileName)
            const metadata = {
                contentType: file.images[i].mimetype,
            }

            const saveImage = {}
            file.item.imageId.push({ _id: saveImage._id })
            await file.item.save()

            await uploadBytesResumable(storageRef, file.images[i].buffer, metadata)
        }
        return
    }
}

router.post("/test-upload", upload, async (req, res) => {
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer,
    }
    try {
        const buildImage = await uploadImage(file, "single")
        res.send({
            status: "SUCCESS",
            imageName: buildImage,
        })
    } catch (error) {
        console.error(error)
    }
})

module.exports = router
