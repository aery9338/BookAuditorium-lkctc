import React, { Fragment } from "react"
import { useIdleTimer } from "react-idle-timer"
import { notification } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import userAuthService from "services/userAuthService"

const IdleTimer = () => {
    const timeout = 30 * 60 * 1000 //30 min
    const promptBeforeIdle = 5 * 60 * 1000 //5 min before expire

    const handleOnIdle = () => {
        if (userAuthService.isAuthenticated()) userAuthService.logout()
    }

    const handleOnAction = (event, timer) => {
        timer?.reset()
        notification.destroy("idle-timer")
    }

    const handleOnPrompt = () => {
        // Check if authorized
        let isauth = userAuthService.isAuthenticated()
        // If authorized then show prompt
        if (isauth === true) {
            notification.open({
                message: "Your Session is About to Expire!",
                description: `This session is going to expire in the next minutes due to inactivity.
                    Press any key to stay logged in.`,
                key: "idle-timer",
                icon: <ExclamationCircleOutlined style={{ color: "#108ee9" }} />,
                duration: 0,
            })
        }
    }

    //const { getRemainingTime } =
    useIdleTimer({
        timeout,
        onIdle: handleOnIdle,
        promptBeforeIdle,
        onPrompt: handleOnPrompt,
        debounce: 1000,
        onAction: handleOnAction,
    })

    return <Fragment />
}

export default IdleTimer
