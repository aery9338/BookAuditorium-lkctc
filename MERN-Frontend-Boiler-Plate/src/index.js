import React from "react"
import { Provider } from "react-redux"
import "antd/dist/antd.min.css"
import GlobalModal from "commonComponents/GlobalModal"
import { createBrowserHistory } from "history"
import ReactDOM from "react-dom/client"
import { AppConfig } from "startup/config"
import IdleTimer from "startup/IdleTimer"
import InternetSocket from "startup/InternetSocket"
import Router from "startup/router"
import { createReduxStore } from "./reduxStore"
import "globalStyles/main.scss"

const history = createBrowserHistory()
export const reduxStore = createReduxStore(history)
const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <Provider store={reduxStore}>
        {AppConfig?.useIdleTimer && <IdleTimer />}
        {AppConfig?.useInternetSocket && <InternetSocket />}
        <GlobalModal />
        <Router history={history} />
    </Provider>
)
