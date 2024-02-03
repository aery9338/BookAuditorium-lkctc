import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MdOutlineLocationCity, MdOutlineOpenInNew } from "react-icons/md"
import { PiMicrophoneStageThin, PiTelevisionDuotone } from "react-icons/pi"
import { RiProjector2Fill } from "react-icons/ri"
import { Button, Popover, Tooltip, Typography } from "antd"
import { selectIsAdmin } from "reduxStore/selectors"
import "./styles.scss"

const AuditoriumCard = ({ auditorium, onEdit }) => {
    const navigate = useNavigate()
    const isAdmin = useSelector(selectIsAdmin)
    const [deletePopover, setDeletePopover] = useState(false)

    let includesTv = false
    let includesMic = false
    let includesProjector = false
    auditorium?.features?.forEach((feature) => {
        if (!includesTv && ["tv", "television", "smart tv"]?.includes(feature?.name?.toLowerCase())) includesTv = true
        if (!includesMic && ["mic", "microphone"]?.includes(feature?.name?.toLowerCase())) includesMic = true
        if (!includesProjector && ["projector"]?.includes(feature?.name?.toLowerCase())) includesProjector = true
    })

    return (
        <div className="auditorium-container">
            <div className="image-container">
                <img className="image" src={auditorium?.images?.[0]} alt={""} />
                <Button
                    onClick={() => navigate(`/auditorium/${auditorium.id}?view=true`)}
                    className="preview-image-main-action"
                    size="small"
                >
                    View &nbsp; <MdOutlineOpenInNew />
                </Button>
                <div className="preview-actions">
                    {auditorium?.capacity && (
                        <Tooltip
                            title={
                                <Typography className="preview-image-action-tooltip-title">
                                    {auditorium?.capacity} seats
                                </Typography>
                            }
                            placement="right"
                        >
                            <Button className="preview-action" size="small">
                                <Typography>{auditorium.capacity}</Typography>
                            </Button>
                        </Tooltip>
                    )}
                    {includesMic && (
                        <Tooltip
                            title={<Typography className="preview-image-action-tooltip-title">Includes mic</Typography>}
                            placement="right"
                        >
                            <Button className="preview-action" size="small">
                                <PiMicrophoneStageThin />
                            </Button>
                        </Tooltip>
                    )}
                    {includesProjector && (
                        <Tooltip
                            title={
                                <Typography className="preview-image-action-tooltip-title">
                                    Includes projector
                                </Typography>
                            }
                            placement="right"
                        >
                            <Button className="preview-action" size="small">
                                <RiProjector2Fill />
                            </Button>
                        </Tooltip>
                    )}
                    {includesTv && (
                        <Tooltip
                            title={<Typography className="preview-image-action-tooltip-title">Includes TV</Typography>}
                            placement="right"
                        >
                            <Button className="preview-action" size="small">
                                <PiTelevisionDuotone />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div className="auditorium-content">
                <div className="auditorium-details">
                    <div className="title">{auditorium?.title}</div>
                    <div className="sub-title overflow-ellipsis">{auditorium?.description}</div>
                    <div className="description">
                        <MdOutlineLocationCity /> &nbsp; {auditorium?.destination?.block}
                    </div>
                    <div className="description">Capacity: {auditorium?.capacity} people</div>
                    <div className="features">
                        {auditorium?.features?.map((feature, index) => {
                            return (
                                <div key={index} className="feature">
                                    {feature?.name}
                                </div>
                            )
                        })}
                    </div>
                </div>
                {isAdmin ? (
                    <div className="auditorium-actions">
                        <Button onClick={() => setDeletePopover()}>Delete</Button>
                        <Button onClick={() => onEdit(auditorium)} type="primary">
                            Edit
                        </Button>
                    </div>
                ) : (
                    <div className="auditorium-actions">
                        <Button onClick={() => navigate(`/auditorium/${auditorium._id}?view=true`)}>Details</Button>
                        <Button onClick={() => navigate(`/auditorium/${auditorium._id}?view=false`)} type="primary">
                            Book
                        </Button>
                    </div>
                )}
            </div>
            <Popover open={deletePopover} title={"Delete " + auditorium.title}></Popover>
        </div>
    )
}

export default AuditoriumCard
