import React from "react"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
// import { CgCloseO } from "react-icons/cg"
// import { Button, Typography } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { Spin } from "customComponents"
import { selectAllAuditoriums } from "reduxStore/selectors"
import "./styles.scss"

const Homepage = () => {
    const [loading, setLoading] = React.useState(true)
    const auditoriums = useSelector(selectAllAuditoriums)

    React.useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <div className="homepage-container">
            <Helmet>
                <title>Book Auditorium (LKCTC)</title>
                <meta name="description" content="Book Auditorium (LKCTC)" />
            </Helmet>
            {loading ? (
                <Spin size="small" />
            ) : (
                <div className="content">
                    {/* <div className="banner">
                        <div className="header-content">
                            <CgCloseO className="close-icon" />
                            <Typography className="header">Lyallpur Khalsa College Technical Campus (LKCTC)</Typography>
                            <Typography className="description">
                                Disseminating Knowledge Creativity and Leadership
                            </Typography>
                        </div>
                        <div className="action-content">
                            <Button type="primary">Visit Website</Button>
                        </div>
                    </div> */}

                    <div className="main-container">
                        <div className="header-content">
                            <div className="header">Meeting Rooms ({auditoriums.length ?? 0})</div>
                            <div className="description">
                                Here you can choose a suitable meeting room, <br />
                                book and invite students for a meeting.
                            </div>
                        </div>

                        <div className="auditoriums-container">
                            {auditoriums?.map((auditorium, index) => {
                                return <AuditoriumCard key={index} auditorium={auditorium} />
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Homepage
