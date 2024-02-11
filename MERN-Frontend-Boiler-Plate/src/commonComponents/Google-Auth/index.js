import React from "react"
import { Button, Tooltip } from "antd"
import GoogleIcon from "assets/svgs/google.svg"
import "./styles.scss"

const GoogleAuth = () => {
    return (
        <div className="social-buttons">
            <Tooltip placement="bottom" title="Coming soon">
                <Button size="large" type="text" className="social-button" onClick={() => null}>
                    <img src={GoogleIcon} alt="google login" className="social-button__icon" />
                </Button>
            </Tooltip>
        </div>
    )
}

export default GoogleAuth
