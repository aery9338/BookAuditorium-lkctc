// firebase.js
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBaaCyP7QKTRtS17h0PXsZ8Ko_LeNq6bcM",
    authDomain: "testing-1eef1.firebaseapp.com",
    projectId: "testing-1eef1",
    storageBucket: "testing-1eef1.appspot.com",
    messagingSenderId: "1019598012408",
    appId: "1:1019598012408:web:84ef53b058c920023b200d",
    measurementId: "G-SJ9S8CNX1V",
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

export default storage
