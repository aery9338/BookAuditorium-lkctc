/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { message, notification } from "antd"
import io from "socket.io-client"
import { configActions, userActions } from "reduxStore"
import { selectUserData } from "reduxStore/selectors"
import { AppConfig } from "./config"

function ServerSocket() {
    const connectionKey = "server-connection"
    const dispatch = useDispatch()
    const userData = useSelector(selectUserData)
    const [isServerConnected, setIsServerConnected] = useState(true)
    const [isInitialRendering, setIsInitialRendering] = useState(true)

    // Use useRef to maintain a single instance of the socket
    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = io(AppConfig.serverBaseUrl)
        socketRef.current.io.on("error", (error) => setIsServerConnected(false))
        socketRef.current.on("connect", () => {
            setIsServerConnected(true)
            setIsInitialRendering(false)
        })
        socketRef.current.on("disconnect", () => setIsServerConnected(false))

        return () => {
            socketRef.current.close()
        }
    }, [])

    useEffect(() => {
        const socket = socketRef.current
        socket.on(`notification-${userData._id}`, ({ message, description, type }) => {
            if (message)
                notification.open({
                    message,
                    description,
                    placement: "bottomRight",
                    duration: 10,
                })
            dispatch(userActions.getNotifications())
            if (type === "new-request") dispatch(userActions.getBookingRequests())
            else if (type === "response-to-request") dispatch(userActions.getBookingDetails())
        })

        return () => socket.off(`notification-${userData._id}`)
    }, [userData])

    useEffect(() => {
        dispatch(configActions.setState({ serverConnection: isServerConnected }))
        if (!isServerConnected) {
            message.warning({
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
