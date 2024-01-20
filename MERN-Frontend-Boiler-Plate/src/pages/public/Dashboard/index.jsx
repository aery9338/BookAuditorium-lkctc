import React from "react"
import { useSelector } from "react-redux"
import { Spin } from "customComponents"
import { selectUserData } from "reduxStore/selectors"
import "./styles.scss"

const Dashboard = () => {
    const userData = useSelector(selectUserData)
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
