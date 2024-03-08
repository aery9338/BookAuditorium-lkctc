import React from "react"
import { Provider } from "react-redux"
import { createBrowserHistory } from "history"
import ReactDOM from "react-dom/client"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import { AppConfig } from "startup/config"
import IdleTimer from "startup/IdleTimer"
import InternetSocket from "startup/InternetSocket"
import Router from "startup/router"
import ServerSocket from "startup/serverSocket"
import { createReduxStore } from "./reduxStore"
import "globalStyles/main.scss"

const history = createBrowserHistory()
export const reduxStore = createReduxStore(history)
const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <Provider store={reduxStore}>
        {AppConfig?.useIdleTimer && <IdleTimer />}
        {AppConfig?.useServerSocket && <ServerSocket />}
        {AppConfig?.useInternetSocket && <InternetSocket />}
        <Router history={history} />
    </Provider>
)
