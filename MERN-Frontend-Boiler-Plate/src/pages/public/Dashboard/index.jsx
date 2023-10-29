import React from "react"
import { Spin } from "customComponents"
import "./styles.scss"

const Dashboard = () => {
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(false)
    }, [])

    return <div className="dashboard-conatiner">{loading ? <Spin /> : <div className="content"></div>}</div>
}

export default Dashboard
