export const selectConfig = (state) => state.config

export const selectIsOnline = (state) => state.config.internetConnection

export const selectIsServerConnected = (state) => state.config.serverConnection

export const selectIsConfigLoading = (state) => state.config.loading

export const selectIsConfigInitialLoading = (state) => state.config.initialLoading
