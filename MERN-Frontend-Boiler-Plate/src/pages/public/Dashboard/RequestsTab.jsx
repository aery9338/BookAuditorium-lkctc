import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Slider from "react-slick"
import { AiOutlineAppstore, AiOutlineBars } from "react-icons/ai"
// import { HiPlus } from "react-icons/hi"
import { MdDeleteForever } from "react-icons/md"
import { Button, Flex, Image, message as Message, Popconfirm, Segmented, Tag, Tooltip, Typography } from "antd"
import { userActions } from "reduxStore"
import {
    selectAllBookingRequests,
    selectBookingDetails,
    selectEventsDetails,
    selectIsAdmin,
    selectIsFaculty,
    selectIsStaff,
} from "reduxStore/selectors"
import bookingService from "services/bookingService"
import { Departments, Occasions } from "utils/constants"
import { animatedIcons } from "assets/animatedIcons"

const RequestsTab = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAdmin = useSelector(selectIsAdmin)
    const isFaculty = useSelector(selectIsFaculty)
    const isStaff = useSelector(selectIsStaff)
    const requetsDetails = useSelector(
        isAdmin ? selectAllBookingRequests : isFaculty ? selectBookingDetails : selectEventsDetails
    )
    const requests = useMemo(() => requetsDetails.data, [requetsDetails])
    const [activeTab, setAciveTab] = useState("all")
    const [listType, setListType] = useState("list")

    const tabsItems = [
        ...(!isStaff
            ? [
                  {
                      value: "all",
                      label: `All Requests (${requetsDetails.totalCount ?? 0})`,
                  },
                  {
                      value: "pending",
                      label: `Pending (${
                          requests?.filter((request) => request.bookingstatus === "pending").length ?? 0
                      })`,
                  },
                  {
                      value: "approved",
                      label: `Approved (${
                          requests?.filter((request) => request.bookingstatus === "approved").length ?? 0
                      })`,
                  },
                  {
                      value: "rejected",
                      label: `Rejected (${
                          requests?.filter((request) => request.bookingstatus === "rejected").length ?? 0
                      })`,
                  },
              ]
            : [
                  {
                      value: "today",
                      label: `Today Events (${
                          requests?.filter(
                              (request) =>
                                  new Date(request.bookingdate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
                          ).length ?? 0
                      })`,
                  },
                  {
                      value: "all",
                      label: `All Events (${requetsDetails.totalCount ?? 0})`,
                  },
              ]),
        ...(isAdmin || isStaff
            ? []
            : [
                  {
                      value: "cancelled",
                      label: `Cancelled (${
                          requests?.filter((request) => request.bookingstatus === "cancelled").length ?? 0
                      })`,
                  },
              ]),
    ]

    const onModifingRequest = async (id, bookingstatus) => {
        const { error, message } = await bookingService.modifyBookingRequest(id, { bookingstatus })
        if (error) Message.error(message)
        else {
            Message.success(message)
            dispatch(isAdmin ? userActions.getBookingRequests() : userActions.getBookingDetails())
        }
    }

    return (
        <Flex className={`requests-wrapper ${listType === "card" ? "grid-type" : ""}`} vertical>
            {/* <Flex className="banner" align="center" justify="space-between">
                <Flex className="banner-text" vertical>
                    <Typography className="banner-text-sub-title">Create new booking of auditorium here</Typography>
                </Flex>
                <Flex className="banner-actions">
                    <Button type="primary" size="small" onClick={() => navigate("/#auditoriums")}>
                        <HiPlus size={16} /> &nbsp; New requests
                    </Button>
                </Flex>
            </Flex> */}
            <Flex justify="space-between" align="center" gap={"large"}>
                <Segmented value={activeTab} options={tabsItems} onChange={setAciveTab} />
                <Segmented
                    className="view-type"
                    size="small"
                    onChange={setListType}
                    value={listType}
                    options={[
                        { value: "list", icon: <AiOutlineBars /> },
                        { value: "card", icon: <AiOutlineAppstore /> },
                    ]}
                />
            </Flex>
            <Flex vertical className="requests-container">
                {requests?.flatMap((request) => {
                    let {
                        _id,
                        auditorium,
                        occasion,
                        title,
                        department,
                        bookingdate,
                        starttime,
                        endtime,
                        bookingstatus,
                        createdby,
                        staff: { displayname } = { displayname: "-" },
                    } = request
                    bookingdate = new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }).format(new Date(bookingdate))

                    const now = new Date()
                    const isUpcoming = new Date(starttime) > now
                    const isOngoing = new Date(starttime) <= now && now <= new Date(endtime)
                    const isEnded = now > new Date(endtime)

                    if (activeTab === "pending" && bookingstatus !== "pending") return []
                    else if (activeTab === "approved" && bookingstatus !== "approved") return []
                    else if (activeTab === "rejected" && bookingstatus !== "rejected") return []
                    else if (activeTab === "cancelled" && bookingstatus !== "cancelled") return []
                    else if (
                        activeTab === "today" &&
                        new Date(request.bookingdate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)
                    )
                        return []

                    return (
                        <Flex key={request._id} className="request-card-wrapper">
                            <Flex className="request-card" gap={"large"} align="center">
                                <Flex
                                    className="auditorium-wrapper"
                                    gap={"middle"}
                                    align="center"
                                    onClick={() => navigate(`/auditorium/${auditorium?._id}?view=false`)}
                                >
                                    <Slider
                                        dots={false}
                                        arrows={false}
                                        infinite={true}
                                        speed={1600}
                                        slidesToShow={1}
                                        slidesToScroll={1}
                                        autoplay={true}
                                        autoplaySpeed={5600}
                                    >
                                        {auditorium?.images?.map((image) => (
                                            <Image key={image} className="preview-image" preview={false} src={image} />
                                        ))}
                                    </Slider>
                                    <Flex className="auditorium-details" vertical gap={"small"}>
                                        <Typography className="header">{auditorium.title}</Typography>
                                        <Typography className="description">{auditorium.description}</Typography>
                                    </Flex>
                                </Flex>
                                <Flex className="request-details" align="flex-start">
                                    {!isFaculty && (
                                        <Flex gap={"small"} align="center">
                                            <Typography className="title">Faculty :</Typography>
                                            <Typography className="sub-title">
                                                {createdby.displayname ?? "-"}
                                            </Typography>
                                        </Flex>
                                    )}
                                    <Flex align="center" gap={"small"}>
                                        <Typography className="title">Title :</Typography>
                                        <Tooltip title={title}>
                                            <Typography className="sub-title">{title}</Typography>
                                        </Tooltip>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">Occasion :</Typography>
                                        <Typography className="sub-title">{Occasions[occasion]}</Typography>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">Department :</Typography>
                                        <Typography className="sub-title">{Departments[department]}</Typography>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">Staff :</Typography>
                                        <Typography className="sub-title">{displayname}</Typography>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">Booking date :</Typography>
                                        <Typography className="sub-title">{bookingdate}</Typography>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">From :</Typography>
                                        <Typography className="sub-title">
                                            {new Intl.DateTimeFormat("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            }).format(new Date(starttime))}
                                        </Typography>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">To :</Typography>
                                        <Typography className="sub-title">
                                            {new Intl.DateTimeFormat("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            }).format(new Date(endtime))}
                                        </Typography>
                                    </Flex>
                                </Flex>
                                {isFaculty && (
                                    <Flex className="action-container" justify="center">
                                        {bookingstatus === "rejected" && (
                                            <Tag color="#f50">
                                                Rejected
                                                <img className="icon" src={animatedIcons.cross} alt="pending" />
                                            </Tag>
                                        )}
                                        {bookingstatus === "pending" && (
                                            <Tag color="#f1a114">
                                                Pending
                                                <img className="icon" src={animatedIcons.waiting} alt="pending" />
                                            </Tag>
                                        )}
                                        {bookingstatus === "approved" && (
                                            <Tag color="#87d068">
                                                Approved
                                                <img className="icon" src={animatedIcons.check} alt="pending" />
                                            </Tag>
                                        )}
                                    </Flex>
                                )}
                                {isStaff && (
                                    <Flex className="action-container" justify="center">
                                        {isUpcoming && (
                                            <Tag color="#87d068">
                                                Upcoming
                                                <img className="icon" src={animatedIcons.waiting} alt="pending" />
                                            </Tag>
                                        )}
                                        {isOngoing && (
                                            <Tag color="#f1a114">
                                                Ongoing
                                                <img className="icon" src={animatedIcons.clock} alt="pending" />
                                            </Tag>
                                        )}
                                        {isEnded && (
                                            <Tag color="#eb0b0bd9">
                                                Ended
                                                <img className="icon" src={animatedIcons.cross} alt="pending" />
                                            </Tag>
                                        )}
                                    </Flex>
                                )}
                                {bookingstatus === "pending" && isAdmin && (
                                    <Flex className="action-container" justify="space-between">
                                        <Popconfirm
                                            title={`Are you sure you want to reject ${title} request!`}
                                            okText="Reject"
                                            onConfirm={() => onModifingRequest(_id, "rejected")}
                                        >
                                            <Button>Reject</Button>
                                        </Popconfirm>
                                        <Popconfirm
                                            title={`Are you sure you want to approve ${title} request!`}
                                            okText="Approve"
                                            onConfirm={() => onModifingRequest(_id, "approved")}
                                        >
                                            <Button type="primary">Approve</Button>
                                        </Popconfirm>
                                    </Flex>
                                )}
                                {bookingstatus === "pending" && isFaculty && (
                                    <Popconfirm
                                        title={`Are you sure you want to cancel ${title} request!`}
                                        okText="Delete"
                                        onConfirm={() => onModifingRequest(_id, "cancelled")}
                                    >
                                        <Flex className="delete-action">
                                            <Button type="primary" size="small">
                                                <MdDeleteForever />
                                            </Button>
                                        </Flex>
                                    </Popconfirm>
                                )}
                            </Flex>
                        </Flex>
                    )
                })}
            </Flex>
        </Flex>
    )
}

export default RequestsTab
