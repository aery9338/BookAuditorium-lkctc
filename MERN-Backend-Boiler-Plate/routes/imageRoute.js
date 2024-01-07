// routes/imageRoute.js
const express = require("express")
const router = express.Router()

const { upload } = require("../middleware/multer")
const { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } = require("firebase/storage")

async function uploadImage(file, quantity) {
    const storageFB = getStorage()
    const email = "testaccount@gmail.com"
    const password = "Test@123"
    // await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

    if (quantity === "single") {
        const dateTime = Date.now()
        const name = file.name
        const fileName = `images/${name}`
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

            const saveImage = await Image.create({ imageUrl: fileName })
            file.item.imageId.push({ _id: saveImage._id })
            await file.item.save()

            await uploadBytesResumable(storageRef, file.images[i].buffer, metadata)
        }
        return
    }
}

async function downloadImage(image, destination = "images") {
    const storageFB = getStorage()
    const dest = destination
    try {
        const storageRef = ref(storageFB, `${dest}/${image}`)
        const downloadURL = await getDownloadURL(storageRef)
        return downloadURL
    } catch (err) {
        return err
    }
}

async function getImagesList(destination = "images/") {
    const storageFB = getStorage()
    const storageRef = ref(storageFB, destination)
    const list = []
    try {
        const res = await listAll(storageRef)
        await Promise.all(res.items.map(async (imageRef) => {
            list.push(imageRef?.name)
            console.log(imageRef.name)
        }));
        return list

    } catch (err) {
        return err
    }
}

router.post("/upload", upload, async (req, res) => {
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer,
        name: req.file.originalname,
    }
    try {
        const buildImage = await uploadImage(file, "single")
        const name = req.file.filename
        res.send({
            status: "SUCCESS",
            imageName: buildImage,
            filename: name,
        })
    } catch (err) {
        console.log(err)
    }
})

router.get("/all", async (req, res) => {
    try {
        const storageFB = getStorage()
        const storageRef = ref(storageFB, "images/")
        const list = await listAll(storageRef)
        const listItems = []
        list.items.map((item, index) => {
            listItems.push({ index: item.name })
        })
        res.send({ "list": listItems })
    } catch (err) {
        console.log(err)
    }
})

router.get("/:name", async (req, res) => {
    try {
        const { name } = req.params
        const downloadURL = await downloadImage(name)
        if (downloadURL.name === "FirebaseError")
            return res.send(
                {
                    "downloadURL": "",
                    "message": "File not present or filename.fileextension"
                })
        res.send({ downloadURL })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
