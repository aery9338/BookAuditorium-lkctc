import { all } from "redux-saga/effects"
import config from "./config/sagas"
import globalModal from "./globalModal/sagas"
import user from "./user/sagas"

export default function* rootSaga() {
    yield all([config(), user(), globalModal()])
}
