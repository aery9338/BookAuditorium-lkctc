import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import { Typography } from "antd"
import { icons } from "assets/svgs"
import "./styles.scss"

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="footer">
                <Fragment>
                    &#169; 2023 LKCTC Inc.
                    <Typography.Link href="https://github.com/aery9338">Avinav Aery</Typography.Link>
                </Fragment>
                <div className="footer-social-icons">
                    <Link to={""}>
                        <img className="social-icon" src={icons.instagram} alt="instagram" />
                    </Link>
                    <Link to={""}>
                        <img className="social-icon" src={icons.facebook} alt="facebook" />
                    </Link>
                    <Link to={""}>
                        <img className="social-icon" src={icons.pinterest} alt="pinterest" />
                    </Link>
                    <Link to={""}>
                        <img className="social-icon" src={icons.twitter} alt="twitter" />
                    </Link>
                    <Link to={""}>
                        <img className="social-icon" src={icons.linkedin} alt="twitter" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer
