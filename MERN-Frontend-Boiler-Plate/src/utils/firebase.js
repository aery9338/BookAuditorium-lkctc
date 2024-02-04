// firebase.js
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyARJioZucAmoleDd5EFAEDA2DQ4NbBHy9Y",
    authDomain: "bookauditorium.firebaseapp.com",
    projectId: "bookauditorium",
    storageBucket: "bookauditorium.appspot.com",
    messagingSenderId: "689491447111",
    appId: "1:689491447111:web:38ed3970e86167b9eb9062",
    measurementId: "G-BR1WEYZ3J0",
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

export default storage
