/* eslint-disable max-len */
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { useNavigate, useParams } from "react-router-dom"
import { BiSolidPaperPlane } from "react-icons/bi"
import { BsAsterisk } from "react-icons/bs"
import { FaPeopleGroup } from "react-icons/fa6"
import { MdOutlineLocationCity } from "react-icons/md"
import { PiMicrophoneStageThin, PiTelevision } from "react-icons/pi"
import { RiProjector2Fill } from "react-icons/ri"
import { Button, DatePicker, Form, Input, TimePicker, Typography } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { Spin } from "customComponents"
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

    const onFinish = () => {}
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
                                        <Form.Item name="title" hasFeedback rules={[{ required: true }]}>
                                            <div className="form-item">
                                                <label>Title:</label>
                                                <Input placeholder="Title" />
                                            </div>
                                        </Form.Item>
                                        {/*Meeting Agenda*/}
                                        <Form.Item name="agenda" hasFeedback rules={[{ required: true }]}>
                                            <div className="form-item">
                                                <label>Meeting Agenda:</label>
                                                <Input.TextArea placeholder="Meeting agenda" />
                                            </div>
                                        </Form.Item>
                                        {/*Meeting Type*/}
                                        <Form.Item name="type" hasFeedback rules={[{ required: true }]}>
                                            <div className="form-item">
                                                <label>Meeting type:</label>
                                                <Input placeholder="Meeting type" />
                                            </div>
                                        </Form.Item>
                                        {/*Date*/}
                                        <Form.Item name="date" hasFeedback rules={[{ required: true }]}>
                                            <div className="form-item">
                                                <label>Date:</label>
                                                <DatePicker onChange={() => null} />
                                            </div>
                                        </Form.Item>
                                        {/*Booking time*/}
                                        <Form.Item name="time" hasFeedback rules={[{ required: true }]}>
                                            <div className="form-item">
                                                <label>Booking time:</label>
                                                <TimePicker.RangePicker popupClassName="custom-time-picker" />
                                            </div>
                                        </Form.Item>
                                        {/*Department*/}
                                        <Form.Item name="type" hasFeedback rules={[{ required: true }]}>
                                            <div className="form-item">
                                                <label>Department:</label>
                                                <Input placeholder="Department" />
                                            </div>
                                        </Form.Item>
                                        {/*Project*/}
                                        <Form.Item name="type" hasFeedback rules={[{ required: false }]}>
                                            <div className="form-item">
                                                <label>
                                                    Project: <span className="optional-text">(Optional)</span>
                                                </label>
                                                <Input placeholder="Project" />
                                            </div>
                                        </Form.Item>
                                        {/* Submit */}
                                        <div className="actions">
                                            <Button type="primary">Apply</Button>
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
