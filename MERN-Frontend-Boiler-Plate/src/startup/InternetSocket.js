import { Fragment, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { message } from "antd"
import { configActions } from "reduxStore"

const InternetSocket = () => {
    const connectionKey = "internet-connection"
    const dispatch = useDispatch()
    const [isOnline, setIsOnline] = useState(navigator?.onLine)
    const [isInitialRendering, setIsInitialRendering] = useState(true)

    useEffect(() => {
        setIsInitialRendering(false)
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        // Listen for online/offline events
        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        // Clean up event listeners when the component unmounts
        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    useEffect(() => {
        dispatch(configActions.setState({ internetConnection: isOnline }))
        if (!isOnline) {
            message.warn({
                key: connectionKey,
                content: "You are offline.",
                duration: 0,
            })
        } else if (!isInitialRendering) {
            message.destroy(connectionKey)
            message.info({
                key: connectionKey,
                content: "You are back online.",
                duration: 2,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline])

    return <Fragment />
}

export default InternetSocket
