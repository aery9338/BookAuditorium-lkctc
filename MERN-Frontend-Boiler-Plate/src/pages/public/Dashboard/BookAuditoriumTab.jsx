import React from "react"
import { useSelector } from "react-redux"
import { Flex } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { selectAllAuditoriums } from "reduxStore/selectors"

const BookAuditoriumTab = () => {
    const auditoriums = useSelector(selectAllAuditoriums)
    return (
        <Flex className="book-auditorium-wrapper">
            <div className="header-content">
                <div className="header">Auditoriums ({auditoriums.length ?? 0})</div>
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
        </Flex>
    )
}

export default BookAuditoriumTab
