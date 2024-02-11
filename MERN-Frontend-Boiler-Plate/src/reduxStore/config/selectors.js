export const selectConfig = (state) => state.config

export const selectIsOnline = (state) => state.config.internetConnection

export const selectIsConfigLoading = (state) => state.config.loading

export const selectIsConfigInitialLoading = (state) => state.config.initialLoading

export const selectAllAuditoriums = (state) => state.config.auditoriums

export const selectAllFaculties = (state) => state.config.faculties
