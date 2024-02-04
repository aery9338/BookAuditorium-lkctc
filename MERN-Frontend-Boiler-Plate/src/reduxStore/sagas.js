import { all } from "redux-saga/effects"
import admin from "./admin/sagas"
import config from "./config/sagas"
import user from "./user/sagas"

export default function* rootSaga() {
    yield all([config(), user(), admin()])
}
