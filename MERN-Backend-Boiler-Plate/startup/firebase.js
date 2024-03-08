// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")

const firebaseConfig = {
    apiKey: "AIzaSyBO-QiX1NvmtPElow0Oz0-lHT8SjgNHWEg",
    authDomain: "book-auditorium.firebaseapp.com",
    projectId: "book-auditorium",
    storageBucket: "book-auditorium.appspot.com",
    messagingSenderId: "1035856042642",
    appId: "1:1035856042642:web:9ab78373ab4eb89ca3a44b",
    measurementId: "G-MTSMJKP7BC",
}

try {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    module.exports = { auth }
} catch (error) {
    console.error("Firebase initialization error:", error)
    throw error
}
