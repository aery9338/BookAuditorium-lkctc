import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BsPersonCircle } from "react-icons/bs"
import { IoNotificationsOutline } from "react-icons/io5"
import { Button, Dropdown, Typography } from "antd"
import { userActions } from "reduxStore"
import { selectUserData } from "reduxStore/selectors"
import { images } from "assets/images"
import "./styles.scss"

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
    const userData = useSelector(selectUserData)

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
                                    onClick: () => navigate("/profile"),
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
                                <BsPersonCircle className="profle" size={32} />
                                {/* <Typography>{userData?.displayname}</Typography> */}
                            </div>
                        </Button>
                    </Dropdown>
                    <IoNotificationsOutline className="notification" />
                </div>
            </div>
        </div>
    )
}

export default Header
