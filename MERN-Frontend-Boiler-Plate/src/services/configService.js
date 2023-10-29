import http from "./httpService"

class configServices {
    async getConfigData() {
        return await http.get(`/api/config`)
    }
}

export default new configServices()
