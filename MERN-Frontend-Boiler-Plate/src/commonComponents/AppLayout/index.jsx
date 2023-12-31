import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Footer from "commonComponents/Footer"
import Header from "commonComponents/Header"
import Sidebar from "commonComponents/Sidebar"
import { isBoolean } from "lodash"
import { selectIsLoggedIn } from "reduxStore/selectors"
import "./styles.scss"

const validateProps = ({ hideLayout, hideHeader, hideSidebar = true, children }) => {
    return {
        hideHeader: (isBoolean(hideLayout) && hideLayout) || (isBoolean(hideHeader) && hideHeader),
        hideSidebar: (isBoolean(hideLayout) && hideLayout) || (isBoolean(hideSidebar) && hideSidebar),
        children,
    }
}

const AppLayout = (props) => {
    const { hideHeader, hideSidebar, children } = validateProps(props)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        // if (!isLoggedIn) navigate("/login")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn])

    return (
        <div className="app-layout-wrapper">
            <div className="app-layout-container">
                {!hideHeader ? (
                    <div className="app-header-wrapper">
                        <Header />
                    </div>
                ) : (
                    <Fragment />
                )}

                <div className={`app-content-wrapper ${hideHeader ? "full" : ""}`}>
                    {!hideSidebar ? (
                        <div className="app-side-wrapper">
                            <Sidebar />
                        </div>
                    ) : (
                        <Fragment />
                    )}
                    <div className="app-main-content-wrapper">{children}</div>
                </div>

                <div className="app-footer-wrapper">
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default AppLayout
