import React from "react"
import { useSelector } from "react-redux"
import { Button } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { selectAllAuditoriums } from "reduxStore/selectors"

const AuditoriumTab = () => {
    const auditoriums = useSelector(selectAllAuditoriums)
    return (
        <div className="auditorium-wrapper">
            <div className="header-section">
                <div />
                <div>
                    <Button type="primary" onClick={() => null}>
                        + Create new
                    </Button>
                </div>
            </div>
            <div className="list-container">
                {auditoriums?.length > 0 &&
                    auditoriums?.map((auditorium) => {
                        return <AuditoriumCard key={auditorium._id} auditorium={auditorium} />
                    })}
            </div>
        </div>
    )
}

export default AuditoriumTab
