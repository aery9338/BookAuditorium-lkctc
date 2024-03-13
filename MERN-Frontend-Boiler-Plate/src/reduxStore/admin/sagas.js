// import { notification } from "antd"
import {
    all,
    // call,
    put,
    takeEvery,
} from "redux-saga/effects"
import { adminActions } from "reduxStore"
// import adminService from "services/adminService"
import userAuthService from "services/userAuthService"

export function* getAdminData() {
    try {
        if (!userAuthService?.getAccessToken()) return null
        // yield put(adminActions.setState({ loading: true }))
        // const { data, error, message } = yield call(adminService.getAdminData)
        // if (!error) {
        //     const { adminData } = data
        //     yield put(adminActions.setState({ adminData }))
        // } else {
        //     notification.error({ description: message })
        // }
    } catch (error) {
        console.error("Error info: ", error)
    } finally {
        yield put(adminActions.setState({ loading: false }))
    }
}

// Defines which saga should run upon each action dispatch
export default function* rootSaga() {
    yield all([
        takeEvery(adminActions.getAdminData.type, getAdminData),
        getAdminData(), // run once on app load to check user auth
    ])
}
