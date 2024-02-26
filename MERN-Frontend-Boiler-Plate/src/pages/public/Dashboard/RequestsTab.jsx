import React, { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Slider from "react-slick"
import { AiOutlineAppstore, AiOutlineBars } from "react-icons/ai"
import { HiPlus } from "react-icons/hi"
import { Button, Flex, Image, Segmented, Tag, Tooltip, Typography } from "antd"
import { selectBookingDetails } from "reduxStore/selectors"
import { Departments, Occasions } from "utils/constants"
import { icons } from "assets/svgs"

const RequestsTab = () => {
    const navigate = useNavigate()
    const requetsDetails = useSelector(selectBookingDetails)
    const requests = useMemo(() => requetsDetails.data, [requetsDetails])
    const [activeTab, setAciveTab] = useState("all")
    const [listType, setListType] = useState("list")

    const tabsItems = [
        {
            value: "all",
            label: `All Requests (${requetsDetails.totalCount})`,
        },
        {
            value: "approved",
            label: `Approved (${requests?.filter((request) => request.bookingstatus === "approved").length})`,
        },
        {
            value: "pending",
            label: `Pending (${requests?.filter((request) => request.bookingstatus === "pending").length})`,
        },
        {
            value: "rejected",
            label: `Rejected (${requests?.filter((request) => request.bookingstatus === "rejected").length})`,
        },
    ]

    return (
        <Flex className={`requests-wrapper ${listType === "card" ? "grid-type" : ""}`} vertical>
            <Flex className="banner" align="center" justify="space-between">
                <Flex className="banner-text" vertical>
                    <Typography className="banner-text-sub-title">Create new booking of auditorium here</Typography>
                </Flex>
                <Flex className="banner-actions">
                    <Button type="primary" size="small" onClick={() => navigate("/#auditoriums")}>
                        <HiPlus size={16} /> &nbsp; New requests
                    </Button>
                </Flex>
            </Flex>
            <Flex justify="space-between" align="center">
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
                        auditorium,
                        occasion,
                        title,
                        department,
                        bookingdate,
                        starttime,
                        endtime,
                        bookingstatus,
                        staff: { displayname } = { displayname: "-" },
                    } = request
                    bookingdate = new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }).format(new Date(bookingdate))

                    if (activeTab === "pending" && bookingstatus !== "pending") return []
                    else if (activeTab === "approved" && bookingstatus !== "approved") return []
                    else if (activeTab === "rejected" && bookingstatus !== "rejected") return []

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
                                    <Flex className="request-title" align="center" gap={"small"}>
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
                                        <Typography className="sub-title">{starttime}</Typography>
                                    </Flex>
                                    <Flex gap={"small"} align="center">
                                        <Typography className="title">To :</Typography>
                                        <Typography className="sub-title">{endtime}</Typography>
                                    </Flex>
                                </Flex>
                                <Flex>
                                    {bookingstatus === "rejected" && <Tag color="#f50">Rejected</Tag>}
                                    {bookingstatus === "pending" && (
                                        <Tag color="#f1a114">
                                            Pending
                                            <img className="social-icon" src={icons.waiting} alt="twitter" />
                                        </Tag>
                                    )}
                                    {bookingstatus === "approved" && <Tag color="#87d068">Approved</Tag>}
                                </Flex>
                            </Flex>
                        </Flex>
                    )
                })}
            </Flex>
        </Flex>
    )
}

export default RequestsTab
