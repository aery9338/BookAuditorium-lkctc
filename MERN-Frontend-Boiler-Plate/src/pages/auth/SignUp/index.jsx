import React, { Fragment, useEffect } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Card } from "antd"
import { Spin } from "customComponents"
import Signup from "components/Signup"
import { selectIsLoggedIn, selectIsUserLoading } from "reduxStore/selectors"
import "../styles.scss"

const SignupPage = () => {
    const isUserLoading = useSelector(selectIsUserLoading)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn) navigate("/")
        if (!isUserLoading) setLoading(false)
    }, [isLoggedIn, isUserLoading, navigate])

    return (
        <div className="signup-wrapper-page">
            {loading ? (
                <Spin />
            ) : (
                <Fragment>
                    <Helmet>
                        <title>Signup</title>
                        <meta name="description" content="ProgressPicture signup form" />
                    </Helmet>
                    <Card className="signup-card-wrapper">
                        <Signup onLogin={() => navigate("/login")} onAuthenticated={() => navigate("/")} />
                    </Card>
                </Fragment>
            )}
        </div>
    )
}

export default SignupPage
