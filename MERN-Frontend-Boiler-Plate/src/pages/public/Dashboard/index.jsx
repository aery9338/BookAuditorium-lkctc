import React from "react"
import { Spin } from "customComponents"
import "./styles.scss"

const Dashboard = () => {
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <div className="dashboard-conatiner">
            {loading ? (
                <Spin />
            ) : (
                <div className="dashboard-wrapper">
                    <div className="header">Dashboard</div>
                    <div className="profile-wrapper">
                        <div className="profile-pic-container"></div>
                    </div>
                    <div className="menu-wrapper"></div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
