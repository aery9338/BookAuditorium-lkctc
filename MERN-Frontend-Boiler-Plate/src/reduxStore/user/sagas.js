import { notification } from "antd"
import { all, call, put, select, takeEvery } from "redux-saga/effects"
import { configActions, userActions } from "reduxStore"
import userAuthService from "services/userAuthService"
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
            yield put(
                userActions.setState({
                    userData,
                    loggedIn: true,
                    loading: false,
                })
            )
            yield put(configActions.getConfigData())
            notification.success({
                message: "Login successful",
                // description: message,
            })
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
                message: "Account registered",
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

// Defines which saga should run upon each action dispatch
export default function* rootSaga() {
    yield all([
        takeEvery(userActions.toggleViewMode.type, toggleViewMode),
        takeEvery(userActions.loginUser.type, loginUser),
        takeEvery(userActions.signupUser.type, signupUser),
        takeEvery(userActions.logoutUser.type, logoutUser),
        takeEvery(userActions.getUserData.type, getUserData),
        getUserData(), // run once on app load to check user auth
    ])
}
