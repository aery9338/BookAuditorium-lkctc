import store from "store"
import { getExpiryDate } from "utils/helper"
import http from "./httpService"

class userAuthService {
    //check if user is authenticated
    isAuthenticated() {
        let data = store.get("access_token")
        if (!data) return false
        return true
    }

    getAccessToken = () => store.get("access_token")
    getRefreshToken = () => store.get("refresh_token")

    setAccessToken = (token) => store.set("access_token", token, getExpiryDate())
    setRefreshToken = (token) => store.set("refresh_token", token, getExpiryDate())

    async login(data) {
        // TODO: validate data object
        return await http.post(`/api/user/login`, data, { noAuth: true })
    }

    async signup(data) {
        // TODO: validate data object
        return await http.post(`/api/user/signup`, data, { noAuth: true })
    }

    async getUserData() {
        return await http.get(`/api/user/me`)
    }

    async checkUsername(username) {
        return await http.get(`/api/user/check_username?username=${username}`)
    }

    logout() {
        store.clearAll()
        window.location.href = "/login"
    }
}

export default new userAuthService()
