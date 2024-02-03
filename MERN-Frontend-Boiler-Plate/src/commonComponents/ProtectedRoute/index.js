import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { selectIsLoggedIn, selectUserRoles } from "reduxStore/selectors"
import { isAuthorized } from "utils/helper"

const Protected = ({ redirect, roles = [], children }) => {
    const loggedIn = useSelector(selectIsLoggedIn)
    const navigate = useNavigate()
    const userRoles = useSelector(selectUserRoles)

    useEffect(() => {
        const authorized = isAuthorized(userRoles, roles)
        if (!loggedIn) navigate("/login")
        else if (loggedIn && !authorized) {
            if (redirect) navigate(redirect)
            else notification.warn({ message: "Access denied", description: "You are not authorized" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const allowed_access = isAuthorized(userRoles, roles)

    const AuthorizedChildren = () => {
        if (!allowed_access) return null
        return <Fragment>{children}</Fragment>
    }

    return AuthorizedChildren()
}

export default Protected
