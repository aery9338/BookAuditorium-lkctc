export const selectConfig = (state) => state.config

export const selectIsOnline = (state) => state.config.internetConnection

export const selectIsServerConnected = (state) => state.config.serverConnection
