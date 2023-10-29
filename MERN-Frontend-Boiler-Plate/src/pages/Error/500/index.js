import React from "react"
import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import { Button } from "antd"
import "../styles.scss"

const Error500 = () => {
    const navigate = useNavigate()

    return (
        <div className="Error">
            <Helmet>
                <title>Error 500</title>
            </Helmet>
            <div className="Error-container">
                <h2 className="Error-heading">Error 500 - Internal Server Error</h2>
                <div className="Error-text">An unexpected error has occurred. We're working on fixing it.</div>
                <Button className="Error-button" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </div>
        </div>
    )
}

export default Error500
