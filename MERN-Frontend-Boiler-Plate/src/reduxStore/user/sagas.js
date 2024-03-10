import { notification } from "antd"
import { all, call, put, select, takeEvery } from "redux-saga/effects"
import { configActions, userActions } from "reduxStore"
import bookingService from "services/bookingService"
import userAuthService from "services/userAuthService"
import { isAuthorized } from "utils/helper"
import initialState from "./initialState"
import { selectViewMode } from "./selectors"

export function* getUserData() {
    try {
        if (!userAuthService?.getAccessToken()) return null
        yield put(userActions.setState({ loading: true }))
        const { data, error, message } = yield call(userAuthService.getUserData)
        if (!error) {
            const { userData } = data
            yield put(userActions.setState({ userData, loggedIn: true }))
            yield call(getNotifications)
            if (isAuthorized(userData?.roles, "faculty")) yield call(getBookingDetails)
            if (isAuthorized(userData?.roles, "staff")) yield call(getEventDetails)
            if (isAuthorized(userData?.roles, ["admin", "superadmin"])) yield call(getBookingRequests)
        } else {
            yield call(logoutUser)
            notification.error({
                message: "User logged out",
                description: message,
            })
        }
    } catch (error) {
        console.error("Error (Get user data): ", error)
    } finally {
        yield put(userActions.setState({ loading: false, initialLoading: false }))
    }
}

export function* toggleViewMode() {
    const viewMode = yield select(selectViewMode)
    yield put(userActions.setState({ viewMode: viewMode === "light" ? "dark" : "light" }))
}

export function* loginUser({ payload }) {
    try {
        yield put(userActions.setState({ loading: true }))
        const { data, error } = yield call(userAuthService.login, payload)
        if (!error) {
            const { userData, access_token, refresh_token } = data
            userAuthService.setAccessToken(access_token)
            userAuthService.setRefreshToken(refresh_token)
            yield call(getUserData)
            yield put(userActions.setState({ userData, loggedIn: true, loading: false }))
            yield put(configActions.getConfigData())
            notification.success({ description: `Welcome ${userData.displayname}!` })
        } else {
            notification.error({
                message: "Login failed",
                description: "wrong username or password",
            })
        }
        yield put(userActions.setState({ loading: false }))
    } catch (error) {
        console.error("Error (Login user): ", error)
        yield put(userActions.setState(initialState))
        notification.error({
            message: "Login failed",
            description: "wrong username or password",
        })
    }
}

export function* signupUser({ payload }) {
    try {
        yield put(userActions.setState({ loading: true }))
        const { data, error, message } = yield call(userAuthService.signup, payload)
        if (!error) {
            const { userData, access_token, refresh_token } = data
            userAuthService.setAccessToken(access_token)
            userAuthService.setRefreshToken(refresh_token)
            yield put(
                userActions.setState({
                    userData,
                    loggedIn: true,
                })
            )
            yield put(configActions.getConfigData())
            notification.success({
                description: `Hi ${userData.displayname}`,
                // description: "Please complete email verification to complete account setup",
            })
        } else {
            notification.error({
                message: "Registration failed",
                description: message,
            })
        }
        yield put(userActions.setState({ loading: false }))
    } catch (error) {
        console.error("Error (Signup user): ", error)
        yield put(userActions.setState(initialState))
        notification.error({
            message: "Registration failed",
            description: error,
        })
    }
}

export function* logoutUser() {
    try {
        yield put(userActions.setState({ loading: true }))
        userAuthService.logout()
        notification.success({ message: "Logged out successfully" })
    } catch (error) {
        console.error(error)
        notification.error({
            message: "Logout failed",
            description: error,
        })
    } finally {
        yield put(userActions.setState(initialState))
    }
}

export function* getBookingDetails() {
    try {
        const { data: bookingDetails, error } = yield call(bookingService.getBookingDetails)
        if (!error) yield put(userActions.setState({ bookingDetails }))
    } catch (error) {
        console.error(error)
    }
}

export function* getEventDetails() {
    try {
        const { data: bookingDetails, error } = yield call(bookingService.getEventDetails)
        if (!error) yield put(userActions.setState({ bookingDetails }))
    } catch (error) {
        console.error(error)
    }
}

export function* getBookingRequests() {
    try {
        const { data: allBookingRequests, error } = yield call(bookingService.getBookingRequests)
        if (!error) yield put(userActions.setState({ allBookingRequests }))
    } catch (error) {
        console.error(error)
    }
}

export function* getNotifications() {
    try {
        const {
            data: { notifications, unreadNotifications },
            error,
        } = yield call(bookingService.getNotifications)
        if (!error) yield put(userActions.setState({ notifications, unreadNotifications }))
    } catch (error) {
        console.error(error)
    }
}

export function* readAllNotification() {
    try {
        const { error } = yield call(bookingService.readAllNotification)
        if (!error) yield call(getNotifications)
    } catch (error) {
        console.error(error)
    }
}

// Defines which saga should run upon each action dispatch
export default function* rootSaga() {
    yield all([
        takeEvery(userActions.toggleViewMode.type, toggleViewMode),
        takeEvery(userActions.loginUser.type, loginUser),
        takeEvery(userActions.signupUser.type, signupUser),
        takeEvery(userActions.logoutUser.type, logoutUser),
        takeEvery(userActions.getUserData.type, getUserData),
        takeEvery(userActions.getBookingDetails.type, getBookingDetails),
        takeEvery(userActions.getBookingRequests.type, getBookingRequests),
        takeEvery(userActions.getNotifications.type, getNotifications),
        takeEvery(userActions.readAllNotification.type, readAllNotification),
        getUserData(),
    ])
}
