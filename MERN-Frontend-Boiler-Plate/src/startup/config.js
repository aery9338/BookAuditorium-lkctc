import { trueValues } from "utils/helper"

const DevelopmentEnv = process.env.REACT_APP_DEVELOPMENT_ENVIROMENT
const StagingEnv = process.env.REACT_APP_STAGING_ENVIROMENT
const ProductionEnv = process.env.REACT_APP_PRODUCTION_ENVIROMENT
const ProjectEnv = process.env.REACT_APP_PROJECT_ENVIROMENT

const isEnvDev = ProjectEnv === DevelopmentEnv
const isEnvStaging = ProjectEnv === StagingEnv
const isEnvProd = ProjectEnv === ProductionEnv
const isEnvDevOrStaging = isEnvDev || isEnvStaging

const clientBaseUrl = process.env.REACT_APP_CLIENT_BASE_URL
const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL
const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID

// const useIdleTimer = false process.env.REACT_APP_USE_IDLE_TIMER
const useIdleTimer = false
const useInternetSocket = process.env.REACT_APP_USE_INTERNET_SOCKET

export const AppConfig = {
    isEnvDev,
    isEnvStaging,
    isEnvDevOrStaging,
    isEnvProd,
    appEnvironment: isEnvProd ? ProductionEnv : isEnvStaging ? StagingEnv : DevelopmentEnv,

    clientBaseUrl,
    serverBaseUrl,
    googleClientId,

    useIdleTimer: trueValues?.includes(useIdleTimer?.toString()?.toLowerCase()),
    useInternetSocket: trueValues?.includes(useInternetSocket?.toString()?.toLowerCase()),
}
