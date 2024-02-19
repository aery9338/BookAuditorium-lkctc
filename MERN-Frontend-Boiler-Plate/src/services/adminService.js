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

    async createFaculty(data) {
        return await http.post(`/api/admin/faculty`, data)
    }

    async createBulkFaculty(data) {
        return await http.post(`/api/admin/faculty/bulk`, data)
    }

    async updateFaculty(id, data) {
        return await http.put(`/api/admin/faculty/${id}`, data)
    }

    async deleteFaculty(id) {
        return await http.delete(`/api/admin/faculty/${id}`)
    }
}

export default new adminService()
