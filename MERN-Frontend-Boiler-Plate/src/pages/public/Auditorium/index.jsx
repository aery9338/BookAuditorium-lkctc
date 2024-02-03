/* eslint-disable max-len */
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { useNavigate, useParams } from "react-router-dom"
import { BiChevronDown, BiSolidPaperPlane } from "react-icons/bi"
import { BsAsterisk } from "react-icons/bs"
import { FaPeopleGroup } from "react-icons/fa6"
import { MdOutlineLocationCity } from "react-icons/md"
import { PiMicrophoneStageThin, PiTelevision } from "react-icons/pi"
import { RiProjector2Fill } from "react-icons/ri"
import { Button, DatePicker, Form, Input, notification, Select, TimePicker, Typography } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { Spin } from "customComponents"
import moment from "moment"
import store from "store"
import { ApplicationTypes, Departments } from "utils/constants"
import { compare, getQueryParams } from "utils/helper"
import { mockupAuditoriumsData } from "utils/mockup"
import "./styles.scss"

const AuditoriumPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const search = getQueryParams()
    const [loading, setLoading] = React.useState(true)
    const [AuditoriumView, setAuditoriumView] = React.useState()
    const [auditoriumsData, setAuditoriumsData] = React.useState([])
    const [auditoriumData, setAuditoriumData] = React.useState({})

    React.useEffect(() => {
        if (mockupAuditoriumsData?.length) setAuditoriumsData(mockupAuditoriumsData)
    }, [])

    React.useEffect(() => {
        // TODO: Change with api hit for id
        if (Object.keys(search)?.length) {
            setAuditoriumView(compare(search?.view, true))
            navigate("", { replace: true, search: null })
        }

        if (auditoriumsData?.length && params?.id) {
            const auditoriumData = auditoriumsData?.find(({ id }) => compare(id, params?.id))
            if (auditoriumData?.id) setAuditoriumData(auditoriumData)
            else navigate("/")
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, params, auditoriumsData])

    const onFinish = (values) => {
        const newApplication = {
            ...values,
            bookingdate: moment(values.bookingdate).format("DD-MM-YYYY"),
            bookingtime: [
                moment(values.bookingtime[0]).format("hh:mm a"),
                moment(values.bookingtime[1]).format("hh:mm a"),
            ],
        }
        const applications = store.get("appliedAplications") ? JSON.parse(store.get("appliedAplications")) : []
        store.set("appliedAplications", JSON.stringify([...applications, newApplication]))
        notification.success("")
    }
    const onFinishFailed = () => {}

    return (
        <div className="auditorium-wrapper">
            <Helmet>
                <title>Book auditorium (LKCTC)</title>
                <meta name="description" content="Book Auditorium (LKCTC)" />
            </Helmet>
            {loading ? (
                <Spin size="small" />
            ) : (
                <div className="content">
                    <div className="main-container">
                        <div className="left-main-container">
                            <div className="auditorium-image">
                                <img src={auditoriumData?.image} alt="" />
                            </div>
                            <div className="auditorium-details">
                                <div className="title">{auditoriumData?.title}</div>
                                <div className="sub-title">{auditoriumData?.description}</div>
                                <div className="description">
                                    <MdOutlineLocationCity /> &nbsp; {auditoriumData?.destination}
                                </div>
                                <div className="divider">
                                    <BsAsterisk />
                                </div>
                                <div className="features">
                                    <Typography className="features-title">This auditorium includes</Typography>
                                    <div className="features-content">
                                        <div className="feature-card-wrapper">
                                            <div className="feature-card">
                                                <div className="feature-image">
                                                    <FaPeopleGroup />
                                                </div>
                                                <div className="feature-content">
                                                    <Typography className="title">
                                                        {auditoriumData?.capacity} Seats
                                                    </Typography>
                                                    <Typography className="description">
                                                        This auditorium offers seating capacity of{" "}
                                                        {auditoriumData?.capacity} individuals.
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>
                                        {auditoriumData?.features?.map((feature, index) => {
                                            let includesTv = false
                                            let includesMic = false
                                            let includesProjector = false

                                            if (!includesTv && ["tv", "television"]?.includes(feature?.toLowerCase()))
                                                includesTv = true
                                            if (!includesMic && ["mic", "microphone"]?.includes(feature?.toLowerCase()))
                                                includesMic = true
                                            if (!includesProjector && ["projector"]?.includes(feature?.toLowerCase()))
                                                includesProjector = true

                                            return (
                                                <div key={index} className="feature-card-wrapper">
                                                    <div className="feature-card">
                                                        <div className="feature-image">
                                                            {includesTv ? (
                                                                <PiTelevision />
                                                            ) : includesMic ? (
                                                                <PiMicrophoneStageThin />
                                                            ) : includesProjector ? (
                                                                <RiProjector2Fill />
                                                            ) : null}
                                                        </div>
                                                        <div className="feature-content">
                                                            <Typography className="title">
                                                                {includesTv
                                                                    ? "Smart TV"
                                                                    : includesMic
                                                                    ? "Microphone"
                                                                    : includesProjector
                                                                    ? "Projector"
                                                                    : null}
                                                            </Typography>
                                                            <Typography className="description">
                                                                {includesTv
                                                                    ? "Experience brilliance with Smart TVs in this auditorium."
                                                                    : includesMic
                                                                    ? "Enhance auditorium events with professional microphones."
                                                                    : includesProjector
                                                                    ? "Elevate presentations with a high-quality auditorium projector."
                                                                    : null}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="actions">
                                    <Button
                                        type={AuditoriumView ? "primary" : "default"}
                                        onClick={() => setAuditoriumView((AuditoriumView) => !AuditoriumView)}
                                    >
                                        {AuditoriumView ? (
                                            <Fragment>
                                                Apply &nbsp; <BiSolidPaperPlane />
                                            </Fragment>
                                        ) : (
                                            <Fragment>Cancel</Fragment>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="right-container">
                            {AuditoriumView ? (
                                <div className="more-auditorium-container">
                                    <Typography className="title">Related Auditorium</Typography>
                                    <div className="auditoriums-container">
                                        {auditoriumsData?.map((auditorium, index) => {
                                            if (compare(auditorium?.id, params?.id)) return null
                                            return <AuditoriumCard key={index} auditorium={auditorium} />
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="book-auditorium-container">
                                    <div className="title">Book {auditoriumData?.title}</div>
                                    <Form
                                        layout="vertical"
                                        className="book-auditorium-form"
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                    >
                                        {/*Title*/}
                                        <Form.Item
                                            required={false}
                                            label="Title:"
                                            name="title"
                                            rules={[{ required: true }]}
                                        >
                                            <Input placeholder="Title" />
                                        </Form.Item>
                                        {/*Meeting Type*/}
                                        <Form.Item
                                            required={false}
                                            name="appliedfor"
                                            label="Applied for:"
                                            rules={[{ required: true }]}
                                        >
                                            <Select
                                                allowClear
                                                placeholder="Select type"
                                                options={Object?.keys(ApplicationTypes)?.map((key) => {
                                                    return { value: key, label: ApplicationTypes[key] }
                                                })}
                                                suffixIcon={<BiChevronDown />}
                                                showSearch
                                            />
                                        </Form.Item>
                                        {/*Date*/}
                                        <Form.Item
                                            required={false}
                                            label="Booking date:"
                                            name="bookingdate"
                                            rules={[{ required: true }]}
                                        >
                                            <DatePicker
                                                format={"DD MMM, YYYY"}
                                                disabledDate={(date) =>
                                                    new Date(date).setHours(0, 0, 0, 0) < Date.now()
                                                }
                                            />
                                        </Form.Item>
                                        {/*Booking time*/}
                                        <Form.Item
                                            required={false}
                                            name="bookingtime"
                                            label="Booking time:"
                                            rules={[{ required: true }]}
                                        >
                                            <TimePicker.RangePicker
                                                minuteStep={10}
                                                // use12Hours
                                                format="hh:mm a"
                                                hideDisabledOptions
                                                disabledTime={() => {
                                                    return {
                                                        disabledHours: () =>
                                                            Array.from({ length: 24 }, (_, i) => i).filter(
                                                                (hour) => hour >= 21 || hour < 9
                                                            ),
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        {/*Department*/}
                                        <Form.Item
                                            required={false}
                                            name="department"
                                            label="Department:"
                                            rules={[{ required: true }]}
                                        >
                                            <Select
                                                allowClear
                                                placeholder="Select department"
                                                options={Object?.keys(Departments)?.map((key) => {
                                                    return { value: key, label: Departments[key] }
                                                })}
                                                suffixIcon={<BiChevronDown />}
                                                showSearch
                                            />
                                        </Form.Item>
                                        {/*Purpose*/}
                                        <Form.Item
                                            required={false}
                                            name="purpose"
                                            label={
                                                <Fragment>
                                                    Purpose: &nbsp;<span className="optional-text">(Optional)</span>
                                                </Fragment>
                                            }
                                        >
                                            <Input.TextArea placeholder="Purpose" />
                                        </Form.Item>
                                        {/* Submit */}
                                        <div className="actions">
                                            <Button type="primary" htmlType="submit">
                                                Apply &nbsp; <BiSolidPaperPlane />
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuditoriumPage
