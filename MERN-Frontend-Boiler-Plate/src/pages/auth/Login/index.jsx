import React, { Fragment, useEffect } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Card } from "antd"
import { Spin } from "customComponents"
import Login from "components/Login"
import { selectIsLoggedIn, selectIsUserLoading } from "reduxStore/selectors"
import "../styles.scss"

const LoginPage = () => {
    const isUserLoading = useSelector(selectIsUserLoading)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn) navigate("/")
        if (!isUserLoading) setLoading(false)
    }, [isLoggedIn, isUserLoading, navigate])

    return (
        <div className="login-wrapper-page">
            {loading ? (
                <Spin />
            ) : (
                <Fragment>
                    <Helmet>
                        <title>Login</title>
                        <meta name="description" content="ProgressPicture login form" />
                    </Helmet>
                    <Card className="login-card-wrapper">
                        <Login onSignup={() => navigate("/signup")} />
                    </Card>
                </Fragment>
            )}
        </div>
    )
}

export default LoginPage
