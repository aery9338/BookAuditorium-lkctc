const AppEnvironmentId = {
    Development: process.env.APP_DEVELOPMENT_ID,
    Staging: process.env.APP_STAGING_ID,
    Production: process.env.APP_PRODUCTION_ID,
}
const ProjectId = process.env.APP_PROJECT_ID

const isEnvDev = ProjectId === AppEnvironmentId.Development
const isEnvStaging = ProjectId === AppEnvironmentId.Staging
const isEnvProd = ProjectId === AppEnvironmentId.Production
const isEnvDevOrStaging = isEnvDev || isEnvStaging

const ProjectDB = isEnvProd
    ? process.env.APP_PRODUCTION_PROJECT_DB
    : isEnvStaging
    ? process.env.APP_STAGING_PROJECT_DB
    : process.env.APP_DEVELOPMENT_PROJECT_DB

const appConfig = {
    isEnvDev,
    isEnvStaging,
    isEnvDevOrStaging,
    isEnvProd,
    ProjectDB,
    appEnvironment: isEnvProd
        ? process.env.APP_PRODUCTION_ENVIORMENT
        : isEnvStaging
        ? process.env.APP_STAGING_ENVIORMENT
        : process.env.APP_DEVELOPMENT_ENVIORMENT,
    companyName: "ABC",
    primaryEmailAddress: process.env.APP_PRIMARY_EMAIL_ADDRESS,
    infoEmailAddress: process.env.APP_INFO_EMAIL_ADDRESS,
    supportEmailAddress: process.env.APP_SUPPORT_EMAIL_ADDRESS,
    jwtSecretKey: process.env.APP_JWT_SECRET_KEY,
    domainName: isEnvProd
        ? process.env.APP_DOMAIN_NAME_PROD
        : isEnvStaging
        ? process.env.APP_DOMAIN_NAME_STAGING
        : process.env.APP_DOMAIN_NAME_DEV,
    domainNameWithProtocol: isEnvProd
        ? `https://${process.env.APP_DOMAIN_NAME_PROD}`
        : isEnvStaging
        ? `https://${process.env.APP_DOMAIN_NAME_STAGING}`
        : `http://${process.env.APP_DOMAIN_NAME_DEV}`,
    rootDir: __dirname,
    defaultPassword: process.env.APP_DEFAULT_USER_PASSWORD,
    officialGmailUser: process.env.APP_GMAIL_USER,
    officialGmailPass: process.env.APP_GMAIL_PASS,
    apiKey: process.env.APP_FIREBASE_API_KEY,
    authDomain: process.env.APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.APP_FIREBASE_APP_ID,
    measurementId: process.env.APP_FIREBASE_MEASURMENT_ID,
}

module.exports = appConfig
