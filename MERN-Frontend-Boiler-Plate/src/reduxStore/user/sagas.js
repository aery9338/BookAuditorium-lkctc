import { notification } from "antd"
import _ from "lodash"
import { all, call, put, takeEvery } from "redux-saga/effects"
import { userActions } from "reduxStore"
import userAuthService from "services/userAuthService"
import initialState from "./initialState"

export function* getUserData() {
    try {
        if (!userAuthService?.getAccessToken()) return null
        yield put(userActions.setState({ loading: true }))
        const { error, data } = yield call(userAuthService.getUserData)
        if (!error) yield put(userActions.setState({ userData: data, loggedIn: true }))
    } catch (error) {
        console.error("Error (Get user data): ", error)
    } finally {
        yield put(userActions.setState({ loading: false }))
    }
}

export function* loginUser({ payload }) {
    try {
        yield put(userActions.setState({ loading: true }))
        const { data, error, message } = yield call(userAuthService.login, payload)
        if (!error) {
            userAuthService.setAccessToken(data?.access_token)
            userAuthService.setRefreshToken(data?.refresh_token)
            yield put(
                userActions.setState({
                    userData: _.pick(data, ["_id", "displayname", "username", "roles", "email"]),
                    loggedIn: true,
                    loading: false,
                })
            )
            notification.success({
                message: "Login successful",
                description: message,
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
            userAuthService.setAccessToken(data?.access_token)
            userAuthService.setRefreshToken(data?.refresh_token)
            yield put(
                userActions.setState({
                    userData: _.pick(data, ["_id", "displayname", "username", "roles", "email"]),
                    loggedIn: true,
                })
            )
            notification.success({
                message: "Account registered",
                description: "Please complete email verification to complete account setup",
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
        takeEvery(userActions.loginUser.type, loginUser),
        takeEvery(userActions.signupUser.type, signupUser),
        takeEvery(userActions.logoutUser.type, logoutUser),
        takeEvery(userActions.getUserData.type, getUserData),
        getUserData(), // run once on app load to check user auth
    ])
}
