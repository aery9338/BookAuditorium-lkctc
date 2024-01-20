const express = require("express")
const router = express.Router()

const { upload } = require("../middleware/multer")
const { getStorage, ref, uploadBytesResumable } = require("firebase/storage")

async function uploadImage(file, quantity) {
    const storageFB = getStorage()
    // const email = "testaccount@gmail.com"
    // const password = "Test@123"
    // await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

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

            // Todo: milan Image is not define
            // const saveImage = await Image.create({ imageUrl: fileName })
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
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
