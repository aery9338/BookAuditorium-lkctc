export * from "./user/selectors"
export * from "./config/selectors"
export * from "./globalModal/selectors"

export const selectCurrentUrlSearch = (state) => state.router.location.search

export const selectCurrentUrlPath = (state) => state.router.location.pathname
