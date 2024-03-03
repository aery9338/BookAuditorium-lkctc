import React from "react"
import { Helmet } from "react-helmet"
import { Button } from "antd"
import "../styles.scss"

const Error500 = () => {
    return (
        <div className="Error">
            <Helmet>
                <title>Error 500</title>
            </Helmet>
            <div className="Error-container">
                <h2 className="Error-heading">Error 500 - Internal Server Error</h2>
                <div className="Error-text">An unexpected error has occurred. Just give it a refresh.</div>
                <Button className="Error-button" onClick={() => window.location.reload()}>
                    Refresh
                </Button>
            </div>
        </div>
    )
}

export default Error500
