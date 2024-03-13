/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from "react"
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
    const timeoutRef = useRef()
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
                if (!notification.readreceipt) {
                    acc.categorized.new.push(notification)
                } else if (new Date().setHours(0, 0, 0, 0) < new Date(notification.createdon)) {
                    acc.categorized.today.push(notification)
                } else if (new Date(new Date().getDate() - 1).setHours(0, 0, 0, 0) < new Date(notification.createdon)) {
                    acc.categorized.yesterday.push(notification)
                } else if ((compare(unit, "week") && compare(count, 1)) || compare(unit, "day")) {
                    acc.categorized.last7days.push(notification)
                } else {
                    acc.categorized.older.push(notification)
                }
                return acc
            },
            { colors: {}, categorized: { new: [], today: [], yesterday: [], last7days: [], older: [] } }
        )
    }, [notifications])

    useEffect(() => {
        if (notificationDrawerVisibility && unreadNotifications > 0) {
            timeoutRef.current = setTimeout(() => {
                dispatch(userActions.readAllNotification())
            }, 3000)
        }

        return () => {
            clearTimeout(timeoutRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationDrawerVisibility])

    const GetRequestNotificationContent = ({
        responseBack = false,
        type = "new",
        status = "",
        bookingRequestCreatedBy = "",
        actionTakenBy = "",
        auditoriumTitle = "",
        bookingTitle = "",
        bookingDate = "",
        startTime = "",
        endTime = "",
    }) => {
        if (type === "new")
            return (
                <Typography className="notification-text">
                    Booking request from <span className="highlight">{bookingRequestCreatedBy}</span> is receiced for{" "}
                    <span className="highlight">{auditoriumTitle}</span> auditorium on{" "}
                    <span className="highlight">{bookingDate}</span> from <span className="highlight">{startTime}</span>{" "}
                    to <span className="highlight">{endTime}</span> entitled{" "}
                    <span className="highlight">{bookingTitle}</span>
                </Typography>
            )
        else if (type === "schedule")
            return (
                <Typography className="notification-text">
                    {actionTakenBy} requested you to join with{" "}
                    <span className="highlight">{bookingRequestCreatedBy}</span> in{" "}
                    <span className="highlight">{auditoriumTitle}</span> auditorium on{" "}
                    <span className="highlight">{bookingDate}</span> from <span className="highlight">{startTime}</span>{" "}
                    to <span className="highlight">{endTime}</span>
                </Typography>
            )
        else if (type === "response" && !responseBack)
            return (
                <Typography className="notification-text">
                    Booking request from <span className="highlight">{bookingRequestCreatedBy}</span> is{" "}
                    <span className="highlight">{status}</span> by <span className="highlight">{actionTakenBy}</span>{" "}
                    for <span className="highlight">{auditoriumTitle}</span> auditorium on{" "}
                    <span className="highlight">{bookingDate}</span> entitled{" "}
                    <span className="highlight">{bookingTitle}</span>
                </Typography>
            )
        else if (responseBack)
            return (
                <Typography className="notification-text">
                    Your booking request is <span className="highlight">{status}</span> by{" "}
                    <span className="highlight">{actionTakenBy}</span> for{" "}
                    <span className="highlight">{auditoriumTitle}</span> auditorium on{" "}
                    <span className="highlight">{bookingDate}</span> entitled{" "}
                    <span className="highlight">{bookingTitle}</span>
                </Typography>
            )
        else return null
    }

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
                                                <GetRequestNotificationContent
                                                    responseBack={compare(
                                                        notification.booking.createdby._id,
                                                        notification.to
                                                    )}
                                                    type={
                                                        notification.status === "pending"
                                                            ? "new"
                                                            : notification.type === "schedule-request"
                                                            ? "schedule"
                                                            : "response"
                                                    }
                                                    bookingRequestCreatedBy={notification.booking.createdby.displayname}
                                                    actionTakenBy={notification.createdby.displayname}
                                                    auditoriumTitle={notification.auditorium.title}
                                                    status={notification.status}
                                                    bookingTitle={notification.booking.title}
                                                    bookingDate={new Intl.DateTimeFormat("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }).format(new Date(notification.booking.bookingdate))}
                                                    startTime={new Intl.DateTimeFormat("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }).format(new Date(notification.booking.starttime))}
                                                    endTime={new Intl.DateTimeFormat("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }).format(new Date(notification.booking.endtime))}
                                                />
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
                                                                100
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
