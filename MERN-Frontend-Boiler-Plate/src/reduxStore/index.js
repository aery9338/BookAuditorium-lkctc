import { configureStore } from "@reduxjs/toolkit"
import { connectRouter, routerMiddleware } from "connected-react-router"
// import { logger } from "redux-logger"
import createSagaMiddleware from "redux-saga"
// import { AppConfig } from "startup/config"
import localStorage from "store"
import { insertIf } from "utils/helper"

import configSlice from "./config"
import globalModalSlice from "./globalModal"
import sagas from "./sagas"
import userSlice from "./user"

const createReduxStore = (history) => {
    const sagaMiddleware = createSagaMiddleware()
    const routeMiddleware = routerMiddleware(history)
    const middlewares = [
        sagaMiddleware,
        routeMiddleware,
        // ...insertIf(AppConfig.isEnvDev, [logger])
    ]
    const persistedState = localStorage.get("reduxState") ? JSON.parse(localStorage.get("reduxState")) : {}
    const ignoredKeys = ["globalModal", "router"]
    const filteredPersistedState = Object.keys(persistedState).reduce((acc, key) => {
        if (!ignoredKeys.includes(key)) {
            const initialLoading = persistedState[key].hasOwnProperty("initialLoading")
            acc[key] = { ...persistedState[key], ...insertIf(initialLoading, { initialLoading }) }
        }
        return acc
    }, {})
    const store = configureStore({
        reducer: {
            router: connectRouter(history),
            [userSlice.name]: userSlice.reducer,
            [configSlice.name]: configSlice.reducer,
            [globalModalSlice.name]: globalModalSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ignoredKeys?.map((stateKey) => stateKey + "/setState"),
                    ignoredPaths: ignoredKeys,
                },
            }).concat(middlewares),
        devTools: { trace: true, traceLimit: 25 },
        preloadedState: filteredPersistedState,
    })
    // Subscribe to store updates and save state to localStorage
    store.subscribe(() => {
        localStorage.set("reduxState", JSON.stringify(store.getState()))
    })
    sagaMiddleware.run(sagas)
    return store
}

export const userActions = userSlice.actions
export const globalModalActions = globalModalSlice.actions
export const configActions = configSlice.actions

export { createReduxStore }
