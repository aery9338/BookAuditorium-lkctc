import http from "./httpService"

class bookingService {
    async getBookingDetails() {
        return await http.get(`/api/booking`)
    }

    async getEventDetails() {
        return await http.get(`/api/booking/events`)
    }

    async getBookingRequests() {
        return await http.get(`/api/booking/requests`)
    }

    async createBookingRequest(data) {
        return await http.post("/api/booking", data)
    }

    async modifyBookingRequest(id, data) {
        return await http.put(`/api/booking/${id}`, data)
    }
}

export default new bookingService()
