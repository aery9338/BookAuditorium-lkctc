import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { IoNotificationsOutline } from "react-icons/io5"
// import { RiMoonClearFill, RiSunFill } from "react-icons/ri"
import { Avatar, Badge, Button, Drawer, Dropdown, Flex, Typography } from "antd"
import ButtonBase from "customComponents/ButtonBase"
import { userActions } from "reduxStore"
import {
    selectNotifications,
    selectUnreadNotifications,
    selectUserData,
    // selectViewMode
} from "reduxStore/selectors"
import { notificationPeriod } from "utils/constants"
import { useQueryParams } from "utils/customHooks"
import { compare, getFirstLetters, getRandomHexColor, timeAgo } from "utils/helper"
import { images } from "assets/images"
import "./styles.scss"

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { setQueryParams } = useQueryParams()
    // const viewMode = useSelector(selectViewMode)
    const userData = useSelector(selectUserData)
    const notifications = useSelector(selectNotifications)
    const unreadNotifications = useSelector(selectUnreadNotifications)
    const [notificationDrawerVisibility, setNotificationDrawerVisibility] = useState(false)
    const filterNotificationData = useMemo(() => {
        return notifications?.reduce(
            (acc, notification) => {
                if (notification.createdby?._id) acc.colors[notification.createdby._id] = getRandomHexColor()

                const { count, unit } = timeAgo(notification.createdon, true)
                if (!notification.readReceipt) {
                    acc.categorized.new.push(notification)
                } else if (["hour", "minute", "second"].includes(unit)) {
                    acc.categorized.today.push(notification)
                } else if ((compare(unit, "week") && compare(count, 1)) || compare(unit, "day")) {
                    acc.categorized.last7days.push(notification)
                } else {
                    acc.categorized.older.push(notification)
                }
                return acc
            },
            { colors: {}, categorized: { new: [], today: [], last7days: [], older: [] } }
        )
    }, [notifications])

    return (
        <div className="header-wrapper">
            <div className="logo-wrapper" onClick={() => navigate("/")}>
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
                                // {
                                //     key: "1",
                                //     label: (
                                //         <Button className="menu-btn" type="link">
                                //             Profile
                                //         </Button>
                                //     ),
                                //     onClick: () => navigate("/dashboard"),
                                // },
                                // {
                                //     key: "2",
                                //     label: (
                                //         <Button className="menu-btn" type="link">
                                //             Help
                                //         </Button>
                                //     ),
                                //     onClick: () => navigate("/help"),
                                // },
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
                        <Button type="primary" className="custom-btn">
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
                    <Badge count={unreadNotifications} offset={[-4, 4]} overflowCount={10}>
                        <Button className="custom-btn" onClick={() => setNotificationDrawerVisibility(true)}>
                            <IoNotificationsOutline className="notification" />
                        </Button>
                    </Badge>
                </div>
            </div>
            <Drawer
                title="Notifications"
                placement={"right"}
                closable={false}
                onClose={() => setNotificationDrawerVisibility(false)}
                open={notificationDrawerVisibility}
                className="notification-drawer"
                key={"notification"}
            >
                <Flex vertical gap={"large"} className="notification-wapper">
                    {Object.keys(filterNotificationData.categorized).flatMap((label) => {
                        const notifications = filterNotificationData.categorized[label]
                        if (!notifications.length) return []
                        return (
                            <Flex vertical gap={"middle"} key={label}>
                                <Typography className="period">{notificationPeriod[label]}</Typography>
                                {notifications.map((notification) => {
                                    return (
                                        <Flex key={notification._id} vertical gap={"middle"} className="card">
                                            <Flex
                                                gap={"large"}
                                                justify="space-between"
                                                className="header"
                                                align="start"
                                            >
                                                <Flex gap={"middle"} align="center">
                                                    <Avatar
                                                        style={
                                                            filterNotificationData.colors[notification.createdby._id]
                                                        }
                                                    >
                                                        {getFirstLetters(notification.createdby.displayname)}
                                                    </Avatar>
                                                    <Typography className="name">
                                                        {notification.createdby.displayname}
                                                    </Typography>
                                                </Flex>
                                                <Typography className="time">
                                                    {timeAgo(notification.createdon)}
                                                </Typography>
                                            </Flex>
                                            <Flex className="notification">
                                                <Typography>
                                                    Booking Request from <span className="text-spacer" />
                                                    <span className="highlight">
                                                        {notification.createdby.displayname}
                                                    </span>
                                                    <span className="text-spacer" /> is receiced for{" "}
                                                    <span className="text-spacer" />
                                                    <span className="highlight">{notification.auditorium.title}</span>
                                                    <span className="text-spacer" /> auditorium on{" "}
                                                    <span className="text-spacer" />
                                                    <span className="highlight">
                                                        {new Intl.DateTimeFormat("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }).format(new Date(notification.booking.bookingdate))}
                                                    </span>
                                                    <span className="text-spacer" /> from{" "}
                                                    <span className="text-spacer" />
                                                    <span className="highlight">
                                                        {new Intl.DateTimeFormat("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }).format(new Date(notification.booking.starttime))}
                                                    </span>
                                                    <span className="text-spacer" /> to <span className="text-spacer" />
                                                    <span className="highlight">
                                                        {new Intl.DateTimeFormat("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }).format(new Date(notification.booking.endtime))}
                                                    </span>
                                                </Typography>
                                            </Flex>
                                            {notification.booking.bookingstatus === "pending" && (
                                                <Flex className="action-wrapper">
                                                    <ButtonBase
                                                        onClick={() => {
                                                            setQueryParams({
                                                                dashboardTab: "requests",
                                                                requestTab: "all",
                                                            })
                                                            setNotificationDrawerVisibility(false)
                                                            setTimeout(
                                                                () =>
                                                                    setQueryParams({
                                                                        dashboardTab: "requests",
                                                                        requestTab: "all",
                                                                        requestId: notification.booking._id,
                                                                    }),
                                                                1
                                                            )
                                                        }}
                                                    >
                                                        <Button size="small">View</Button>
                                                    </ButtonBase>
                                                </Flex>
                                            )}
                                        </Flex>
                                    )
                                })}
                            </Flex>
                        )
                    })}
                </Flex>
            </Drawer>
        </div>
    )
}

export default Header
