import http from "./httpService"

class adminService {
    async getAdminData(data) {
        return await http.get(`/api/admin`)
    }

    async createAuditorium(data) {
        return await http.post(`/api/admin/auditorium`, data)
    }

    async updateAuditorium(id, data) {
        return await http.put(`/api/admin/auditorium/${id}`, data)
    }

    async deleteAuditorium(id) {
        return await http.delete(`/api/admin/auditorium/${id}`)
    }
}

export default new adminService()
