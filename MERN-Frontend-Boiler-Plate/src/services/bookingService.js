import http from "./httpService"

class bookingService {
    async getBookingDetails() {
        return await http.get(`/api/booking`)
    }

    async getBookingRequests() {
        return await http.get(`/api/booking/requests`)
    }

    async createBookingRequest(data) {
        return await http.post("/api/booking", data)
    }
}

export default new bookingService()
