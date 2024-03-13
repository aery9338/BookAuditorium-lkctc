// Import the functions you need from the SDKs you need

const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")
const winston = require("winston")
const appConfig = require("./config")

const firebaseConfig = {
    apiKey: appConfig.apiKey,
    authDomain: appConfig.authDomain,
    projectId: appConfig.projectId,
    storageBucket: appConfig.storageBucket,
    messagingSenderId: appConfig.messagingSenderId,
    appId: appConfig.appId,
    measurementId: appConfig.measurementId,
}

try {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    module.exports = { auth }
} catch (error) {
    winston.error("Firebase initialization error:", error)
    throw error
}
