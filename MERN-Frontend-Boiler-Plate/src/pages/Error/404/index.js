import React from "react"
import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import { Button } from "antd"
import "../styles.scss"

const Error404 = () => {
    const navigate = useNavigate()

    return (
        <div className="Error">
            <Helmet>
                <title>Error 404</title>
            </Helmet>
            <div className="Error-container">
                <h2 className="Error-heading">Error 404 - Page Not Found</h2>
                <div className="Error-text">This page is under maintenance or does not exist.</div>
                <Button className="Error-button" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </div>
        </div>
    )
}

export default Error404
