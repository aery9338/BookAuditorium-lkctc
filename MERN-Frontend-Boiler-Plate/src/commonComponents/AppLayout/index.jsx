import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Footer from "commonComponents/Footer"
import Header from "commonComponents/Header"
import Sidebar from "commonComponents/Sidebar"
import { isBoolean } from "lodash"
import { selectIsLoggedIn, selectViewMode } from "reduxStore/selectors"
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
    const viewMode = useSelector(selectViewMode)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const navigate = useNavigate()
    const path = window.location.pathname

    useEffect(() => {
        if (!isLoggedIn) navigate("/login")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn])

    if (!isLoggedIn && !path.includes("/login")) return null

    return (
        <div className={`app-layout-wrapper ${viewMode === "dark" ? "dark" : ""}`}>
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
