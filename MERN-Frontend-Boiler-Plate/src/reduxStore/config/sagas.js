import { all, call, put, takeEvery } from "redux-saga/effects"
import { configActions } from "reduxStore"
import configService from "services/configService"

export function* getConfigData() {
    try {
        yield put(configActions.setState({ loading: true }))
        const { error, data } = yield call(configService.getConfigData)
        if (!error) yield put(configActions.setState(data))
    } catch (error) {
        console.error(error)
    } finally {
        yield put(configActions.setState({ loading: false, initialLoading: false }))
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(configActions.getConfigData.type, getConfigData),
        getConfigData(), // run once on app load to check user auth
    ])
}
