import { notification } from "antd"
import axios from "axios"
import { AppConfig } from "startup/config"
import { reduxStore } from "index"
import { processHtmlString } from "utils/helper"
import userAuthService from "./userAuthService"

const http = axios.create({
    baseURL: AppConfig.serverBaseUrl,
    timeout: 600000,
})

http.interceptors.request.use(
    (config) => {
        const { internetConnection, serverConnection } = reduxStore.getState().config
        if ((AppConfig.useInternetSocket && !internetConnection) || (AppConfig.useServerSocket && !serverConnection)) {
            if (AppConfig.useInternetSocket || AppConfig.useServerSocket) return
            const errorMessage = "Request failed, No connection to the server"
            notification.error({
                message: "Request failed",
                description: errorMessage,
                key: "network_issue",
                duration: 3,
            })
            return Promise.reject(new Error(errorMessage))
        }
        const token = userAuthService?.getAccessToken()
        if (token && !config?.noAuth) {
            config.headers.common["Authorization"] = "Bearer " + token
        }
        return config
    },
    (error) => Promise.reject(error)
)

http.interceptors.response.use(
    ({ data: responseData }) => {
        if (responseData?.data === "Token Expired") {
            const originalRequest = responseData?.config

            originalRequest._retry = true

            const refreshToken = userAuthService?.getRefreshToken()

            return axios
                .post(AppConfig?.serverBaseUrl + "api/auth/refresh-token", {
                    refresh_token: refreshToken,
                })
                .then((result) => {
                    if (result.status === 200) {
                        const newtoken = result?.headers?.["x-auth-token"]
                        const newrfshtoken = result?.headers?.["x-auth-refresh-token"]
                        userAuthService?.getAccessToken(newtoken)
                        userAuthService?.getRefreshToken(newrfshtoken)
                        originalRequest.headers["Authorization"] = "Bearer " + newtoken
                        return http(originalRequest)
                    }
                })
                .catch((err) => {
                    userAuthService?.logout()
                })
        } else return { data: responseData?.data, error: responseData?.error, message: responseData?.message }
    },
    (error) => {
        if (error?.code === "ECONNABORTED" && error?.message?.includes("timeout")) {
            if (!error?.config?.headers?.Retrying) {
                return http({ ...error?.config, headers: { ...error?.config?.headers, Retrying: true } })
            }
            notification.error("Oops! we are facing high traffic at this moment. Please retry after 5 minutes")
        }
        const expectedError = error.response && error.response.status >= 400 && error.response.status < 500
        const errorResponse = { error: true, message: processHtmlString(error?.response?.data || error?.message, true) }
        console.log("Api Error: ", { ...error, errorResponse, expectedError })
        return errorResponse
    }
)

export default http
