/* eslint-disable max-len */
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Slider from "react-slick"
import { BiChevronDown, BiSolidPaperPlane } from "react-icons/bi"
import { BsAsterisk } from "react-icons/bs"
import { FaPeopleGroup } from "react-icons/fa6"
import { MdOutlineLocationCity } from "react-icons/md"
import { Button, DatePicker, Flex, Form, Input, notification, Select, TimePicker, Typography } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { Spin } from "customComponents"
import { userActions } from "reduxStore"
import { selectAllAuditoriums, selectAllFaculties } from "reduxStore/selectors"
import bookingService from "services/bookingService"
import { Departments, Features, FeaturesDescription, FeaturesIcon, Occasions } from "utils/constants"
import { compare, getQueryParams, isAuthorized } from "utils/helper"
import "./styles.scss"

const AuditoriumPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const search = getQueryParams()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const [loading, setLoading] = React.useState(true)
    const [AuditoriumView, setAuditoriumView] = React.useState()
    const [auditoriumData, setAuditoriumData] = React.useState({})
    const [isBtnLoading, setIsBtnLoading] = React.useState(false)

    const auditoriums = useSelector(selectAllAuditoriums)
    const faculties = useSelector(selectAllFaculties)

    React.useEffect(() => {
        if (Object.keys(search)?.length) {
            setAuditoriumView(compare(search?.view, true))
            navigate("", { replace: true, search: null })
        }

        if (auditoriums?.length && params?.id) {
            const auditoriumData = auditoriums?.find(({ _id }) => compare(_id, params?.id))
            if (auditoriumData?._id) setAuditoriumData(auditoriumData)
            else navigate("/")
            setLoading(false)
        }
    }, [search, params, auditoriums, navigate])

    const onFinish = async ({ title, occasion, department, staff, purpose, ...values }) => {
        try {
            setIsBtnLoading(true)
            const newRequest = {
                title,
                occasion,
                department,
                staff,
                purpose,
                auditorium: auditoriumData._id,
                bookingdate: new Date(values.bookingdate).toLocaleDateString(),
                starttime: new Date(values.bookingtime[0]).toLocaleTimeString(),
                endtime: new Date(values.bookingtime[1]).toLocaleTimeString(),
                // bookingdate: new Intl.DateTimeFormat("en-GB", {
                //     day: "2-digit",
                //     month: "2-digit",
                //     year: "numeric",
                // }).format(values.bookingdate),
                // bookingtime: [
                //     new Intl.DateTimeFormat("en-US", {
                //         hour: "numeric",
                //         minute: "2-digit",
                //         hour12: true,
                //     }).format(values.bookingtime[0]),
                //     new Intl.DateTimeFormat("en-US", {
                //         hour: "numeric",
                //         minute: "2-digit",
                //         hour12: true,
                //     }).format(values.bookingtime[1]),
                // ],
            }
            const { error, message } = await bookingService.createBookingRequest(newRequest)
            if (!error) {
                notification.success({ description: message })
                form.resetFields()
                dispatch(userActions.getBookingDetails())
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsBtnLoading(false)
        }
    }

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
                    <Flex className="banner" align="center" justify="space-between">
                        <Flex className="banner-text" vertical>
                            <Typography className="banner-text-sub-title">Check your requests status here</Typography>
                        </Flex>
                        <Flex className="banner-actions">
                            <Button type="primary" size="small" onClick={() => navigate("/#requests")}>
                                View requests
                            </Button>
                        </Flex>
                    </Flex>
                    <div className="main-container">
                        <div className="left-main-container">
                            <div className="auditorium-image">
                                <Slider
                                    dots={true}
                                    infinite={true}
                                    speed={1600}
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                    autoplay={true}
                                    autoplaySpeed={5600}
                                >
                                    {auditoriumData?.images?.map((image) => (
                                        <img key={image} src={image} alt="" />
                                    ))}
                                </Slider>
                            </div>
                            <div className="auditorium-details">
                                <div className="title">{auditoriumData?.title}</div>
                                <div className="sub-title">{auditoriumData?.description}</div>
                                <div className="description">
                                    <MdOutlineLocationCity /> &nbsp; {auditoriumData?.destination?.block}
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
                                            return (
                                                <div key={index} className="feature-card-wrapper">
                                                    <div className="feature-card">
                                                        <div className="feature-image">
                                                            {FeaturesIcon[feature?.name]}
                                                        </div>
                                                        <div className="feature-content">
                                                            <Typography className="title">
                                                                {Features[feature?.name]}
                                                            </Typography>
                                                            <Typography className="description">
                                                                {feature?.description ??
                                                                    FeaturesDescription[feature?.name]}
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
                                        {auditoriums?.map((auditorium, index) => {
                                            if (compare(auditorium?._id, params?.id)) return null
                                            return <AuditoriumCard key={index} auditorium={auditorium} />
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="book-auditorium-container">
                                    <div className="title">Book {auditoriumData?.title}</div>
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        className="book-auditorium-form"
                                        onFinish={onFinish}
                                    >
                                        {/*Title*/}
                                        <Form.Item
                                            required={false}
                                            label="Title:"
                                            name="title"
                                            rules={[{ required: true, message: "Title is required" }]}
                                        >
                                            <Input placeholder="Title" />
                                        </Form.Item>
                                        {/*Meeting Type*/}
                                        <Form.Item
                                            required={false}
                                            name="occasion"
                                            label="Occasion:"
                                            rules={[{ required: true, message: "Occasion is required" }]}
                                        >
                                            <Select
                                                allowClear
                                                placeholder="Select type"
                                                options={Object?.keys(Occasions)?.map((key) => {
                                                    return { value: key, label: Occasions[key] }
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
                                            rules={[{ required: true, message: "Booking date is required " }]}
                                        >
                                            <DatePicker
                                                format={"DD-MM-YYYY"}
                                                placeholder="Select date (DD-MM-YYYY)"
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
                                            rules={[{ required: true, message: "Booking time is required" }]}
                                        >
                                            <TimePicker.RangePicker
                                                minuteStep={5}
                                                format="hh:mm a"
                                                hideDisabledOptions
                                            />
                                        </Form.Item>
                                        {/*Department*/}
                                        <Form.Item
                                            required={false}
                                            name="department"
                                            label="Department:"
                                            rules={[{ required: true, message: "Department is required" }]}
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
                                        {/*Need staff*/}
                                        <Form.Item required={false} name="staff" label="Need staff:">
                                            <Select
                                                allowClear
                                                placeholder="Select staff"
                                                options={faculties?.flatMap((faculty) => {
                                                    if (!isAuthorized(faculty.roles, "staff")) return []
                                                    return { value: faculty._id, label: faculty.displayname }
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
                                            <Button type="primary" loading={isBtnLoading} htmlType="submit">
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
