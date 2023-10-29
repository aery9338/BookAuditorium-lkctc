import React, { Fragment, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { message } from "antd"
import io from "socket.io-client"
import { configActions } from "reduxStore"
import AppConfig from "./config"

function ServerSocket() {
    const connectionKey = "server-connection"
    const dispatch = useDispatch()
    const [isServerConnected, setIsServerConnected] = useState(true)
    const [isInitialRendering, setIsInitialRendering] = useState(true)

    useEffect(() => {
        const socket = io(AppConfig.serverBaseUrl)
        // Event listener for connection error

        socket.io.on("error", (error) => {
            setIsServerConnected(false)
            console.log("Socket connection error:", error)
            // error.preventDefault()
        })

        socket.on("connect", () => {
            setIsServerConnected(true)
            setIsInitialRendering(false)
        })
        socket.on("disconnect", () => setIsServerConnected(false))
        const heartbeatInterval = setInterval(() => socket.emit("heartbeat"), 1000)
        return () => {
            clearInterval(heartbeatInterval)
            socket.close()
        }
    }, [])

    useEffect(() => {
        dispatch(configActions.setState({ serverConnection: isServerConnected }))
        if (!isServerConnected) {
            message.warn({
                key: connectionKey,
                content: "You are disconnected from the server.",
                duration: 0,
            })
        } else if (!isInitialRendering) {
            message.destroy(connectionKey)
            message.info({
                key: connectionKey,
                content: "Your connection is established to the server.",
                duration: 2,
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isServerConnected])

    return <Fragment />
}

export default ServerSocket
