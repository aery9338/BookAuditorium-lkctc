import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { IoNotificationsOutline } from "react-icons/io5"
// import { RiMoonClearFill, RiSunFill } from "react-icons/ri"
import { Avatar, Button, Dropdown, Typography } from "antd"
import { userActions } from "reduxStore"
import {
    selectUserData,
    // selectViewMode
} from "reduxStore/selectors"
import { getFirstLetters } from "utils/helper"
import { images } from "assets/images"
import "./styles.scss"

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(selectUserData)
    // const viewMode = useSelector(selectViewMode)

    return (
        <div className="header-wrapper">
            <div className="logo-wrapper">
                <img src={images.logo} alt="company_logo" />
                <Typography>
                    Book auditorium <br />
                    (LKCTC)
                </Typography>
            </div>
            <div className="menu-container">
                <div className="menu-wrapper"></div>
                <div className="profie-wrapper">
                    <Dropdown
                        overlayClassName="profile-dropdown"
                        trigger={"click"}
                        menu={{
                            items: [
                                {
                                    key: "1",
                                    label: (
                                        <Button className="menu-btn" type="link">
                                            Profile
                                        </Button>
                                    ),
                                    onClick: () => navigate("/dashboard"),
                                },
                                {
                                    key: "2",
                                    label: (
                                        <Button className="menu-btn" type="link">
                                            Help
                                        </Button>
                                    ),
                                    onClick: () => navigate("/help"),
                                },
                                {
                                    key: "3",
                                    label: (
                                        <Button
                                            className="menu-btn"
                                            type="link"
                                            onClick={() => dispatch(userActions.logoutUser())}
                                        >
                                            Logout
                                        </Button>
                                    ),
                                },
                            ],
                        }}
                    >
                        <Button type="link">
                            <div className="user-profile">
                                <Avatar>{getFirstLetters(userData.displayname)}</Avatar>
                            </div>
                        </Button>
                    </Dropdown>
                    {/* {viewMode === "dark" ? (
                        <Button type="link">
                            <RiSunFill onClick={() => dispatch(userActions.toggleViewMode())} />
                        </Button>
                    ) : (
                        <Button type="link">
                            <RiMoonClearFill onClick={() => dispatch(userActions.toggleViewMode())} />
                        </Button>
                    )} */}
                    <IoNotificationsOutline className="notification" />
                </div>
            </div>
        </div>
    )
}

export default Header
