import React from "react"
import { useNavigate } from "react-router-dom"
import { Tabs } from "antd"
import { Spin } from "customComponents"
import AllAuditoriumsTab from "./AllAuditoriumsTab"
import FacultyTab from "./FacultyTab"
import "./styles.scss"

const Dashboard = () => {
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()

    React.useEffect(() => {
        setLoading(false)
    }, [])

    const tabsItems = {
        allAuditoriums: {
            label: "All Auditoriums",
            children: <AllAuditoriumsTab />,
        },
        requests: {
            label: "Requests",
            children: <></>,
        },
        faculty: {
            label: "Faculty",
            children: <FacultyTab />,
        },
    }

    let defaultTab = window.location.hash?.includes("#") ? window.location.hash?.substring(1) : "auditoriums"

    return (
        <div className="dashboard-conatiner">
            {loading ? (
                <Spin />
            ) : (
                <div className="dashboard-wrapper">
                    <Tabs
                        defaultActiveKey={defaultTab}
                        onChange={(value) => navigate("#" + value)}
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
