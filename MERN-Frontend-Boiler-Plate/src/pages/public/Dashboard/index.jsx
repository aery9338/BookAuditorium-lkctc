import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Tabs } from "antd"
import { Spin } from "customComponents"
import { selectIsAdmin, selectIsFaculty, selectIsStaff } from "reduxStore/selectors"
import { insertIf } from "utils/helper"
import AllAuditoriumsTab from "./AllAuditoriumsTab"
import BookAuditoriumTab from "./BookAuditoriumTab"
import FacultyTab from "./FacultyTab"
import RequestsTab from "./RequestsTab"
import "./styles.scss"

const Dashboard = () => {
    const [loading, setLoading] = React.useState(true)
    let defaultTab = window.location.hash?.includes("#") ? window.location.hash?.substring(1) : "auditoriums"
    const [activeTab, setAciveTab] = React.useState(defaultTab)
    const isAdmin = useSelector(selectIsAdmin)
    const isFaculty = useSelector(selectIsFaculty)
    const isStaff = useSelector(selectIsStaff)
    const navigate = useNavigate()

    React.useEffect(() => {
        setLoading(false)
    }, [])

    const tabsItems = {
        ...insertIf(isAdmin, {
            requests: {
                label: "Requests",
                children: <RequestsTab />,
            },
            allAuditoriums: {
                label: "All Auditoriums",
                children: <AllAuditoriumsTab />,
            },
            faculty: {
                label: "Faculty",
                children: <FacultyTab />,
            },
        }),
        ...insertIf(isFaculty, {
            auditoriums: {
                label: "Book an auditorium",
                children: <BookAuditoriumTab />,
            },
            requests: {
                label: "Your requests",
                children: <RequestsTab />,
            },
        }),
        ...insertIf(isStaff, {
            dashboard: {
                label: "Events",
                children: <RequestsTab />,
            },
        }),
    }

    return (
        <div className="dashboard-conatiner">
            {loading ? (
                <Spin />
            ) : (
                <div className="dashboard-wrapper">
                    <Tabs
                        value={activeTab}
                        onChange={(value) => {
                            setAciveTab(value)
                            navigate("#" + value)
                        }}
                        size={"large"}
                        className="custom-tab"
                        items={Object.keys(tabsItems)?.map((key) => {
                            return { ...tabsItems[key], key }
                        })}
                    />
                </div>
            )}
        </div>
    )
}

export default Dashboard
