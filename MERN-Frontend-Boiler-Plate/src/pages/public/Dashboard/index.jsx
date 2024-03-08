import React, { useMemo } from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { Tabs } from "antd"
import { Spin } from "customComponents"
import { selectUserRole } from "reduxStore/selectors"
import { useQueryParams } from "utils/customHooks"
import AllAuditoriumsTab from "./AllAuditoriumsTab"
import BookAuditoriumTab from "./BookAuditoriumTab"
import FacultyTab from "./FacultyTab"
import RequestsTab from "./RequestsTab"
import "./styles.scss"

const getTabs = (userRole) => {
    switch (userRole) {
        case "admin":
            return [
                {
                    key: "requests",
                    label: "Requests",
                    children: <RequestsTab />,
                },
                {
                    key: "allAuditoriums",
                    label: "All Auditoriums",
                    children: <AllAuditoriumsTab />,
                },
                {
                    key: "faculty",
                    label: "Faculty",
                    children: <FacultyTab />,
                },
            ]

        case "faculty":
            return [
                {
                    key: "auditoriums",
                    label: "Book an auditorium",
                    children: <BookAuditoriumTab />,
                },
                {
                    key: "requests",
                    label: "Your requests",
                    children: <RequestsTab />,
                },
            ]

        case "staff":
            return [
                {
                    key: "events",
                    label: "Events",
                    children: <RequestsTab />,
                },
            ]

        default:
            return []
    }
}

const Dashboard = () => {
    const { getQueryParam, setQueryParam } = useQueryParams()
    const userRole = useSelector(selectUserRole)
    const tabs = useMemo(() => getTabs(userRole), [userRole])
    const [loading, setLoading] = React.useState(true)
    const activeTab = getQueryParam("dashboardTab") ?? tabs[0]?.key

    React.useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <div className="dashboard-conatiner">
            {loading ? (
                <Spin />
            ) : (
                <div className="dashboard-wrapper">
                    <Helmet>
                        <title>Dashboard</title>
                        <meta name="description" content="ProgressPicture login form" />
                    </Helmet>
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => setQueryParam("dashboardTab", key)}
                        size={"large"}
                        className="custom-tab"
                        items={tabs}
                    />
                </div>
            )}
        </div>
    )
}

export default Dashboard
