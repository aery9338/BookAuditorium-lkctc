import { isIncluded } from "utils/helper"

export const selectIsLoggedIn = (state) => state.user.loggedIn

export const selectUserRoles = (state) => state.user.userData.roles

export const selectUsername = (state) => state.user.userData.username

export const selectDisplayName = (state) => state.user.userData.displayName

export const selectEmailAddress = (state) => state.user.userData.email

export const selectUserData = (state) => state.user.userData

export const selectIsUserLoading = (state) => state.user.loading

export const selectIsUserInitialLoading = (state) => state.user.initialLoading

export const selectViewMode = (state) => state.user.viewMode

export const selectIsAdmin = (state) =>
    state.user.userData.roles?.some(({ rolename, isinvoked }) => !isinvoked && isIncluded(rolename, "admin", true))
