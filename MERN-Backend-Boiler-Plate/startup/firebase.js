// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")

const firebaseConfig = {
    apiKey: "AIzaSyARJioZucAmoleDd5EFAEDA2DQ4NbBHy9Y",
    authDomain: "bookauditorium.firebaseapp.com",
    projectId: "bookauditorium",
    storageBucket: "bookauditorium.appspot.com",
    messagingSenderId: "689491447111",
    appId: "1:689491447111:web:38ed3970e86167b9eb9062",
    measurementId: "G-BR1WEYZ3J0",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
module.exports = { auth }
