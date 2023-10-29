import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { selectIsLoggedIn, selectUserRoles } from "reduxStore/selectors"

const Protected = ({ redirect = false, defaultRedirect = "/login", roles = [], children }) => {
    const loggedIn = useSelector(selectIsLoggedIn)
    const navigate = useNavigate()
    const userRoles = useSelector(selectUserRoles)

    useEffect(() => {
        const redirect_url = redirect !== false ? redirect : defaultRedirect
        const authorized = userRoles?.find((role) => roles?.includes(role?.rolename))

        let allowed_access = authorized && loggedIn

        if (!allowed_access) {
            if (redirect_url) navigate(redirect_url)
            if (loggedIn && !authorized)
                notification.warn({ message: "Access denied", description: "You are not authorized" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const allowed_access = userRoles?.find((role) => roles?.includes(role?.rolename)) && loggedIn
    const AuthorizedChildren = () => {
        if (!allowed_access) return null
        return <Fragment>{children}</Fragment>
    }

    return AuthorizedChildren()
}

export default Protected
