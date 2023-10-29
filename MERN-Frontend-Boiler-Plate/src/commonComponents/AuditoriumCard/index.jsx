import React from "react"
import { useNavigate } from "react-router-dom"
import { MdOutlineLocationCity, MdOutlineOpenInNew } from "react-icons/md"
import { PiMicrophoneStageThin, PiTelevisionDuotone } from "react-icons/pi"
import { RiProjector2Fill } from "react-icons/ri"
import { Button, Tooltip, Typography } from "antd"
import "./styles.scss"

const AuditoriumCard = ({ auditorium }) => {
    const navigate = useNavigate()

    let includesTv = false
    let includesMic = false
    let includesProjector = false
    auditorium?.features?.forEach((feature) => {
        if (!includesTv && ["tv", "television"]?.includes(feature?.toLowerCase())) includesTv = true
        if (!includesMic && ["mic", "microphone"]?.includes(feature?.toLowerCase())) includesMic = true
        if (!includesProjector && ["projector"]?.includes(feature?.toLowerCase())) includesProjector = true
    })

    return (
        <div className="auditorium-container">
            <div className="image-container">
                <img className="image" src={auditorium?.image} alt={""} />
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
                        <MdOutlineLocationCity /> &nbsp; {auditorium?.destination}
                    </div>
                    <div className="description">Capacity: {auditorium?.capacity} people</div>
                    <div className="features">
                        {auditorium?.features?.map((feature, index) => {
                            return (
                                <div key={index} className="feature">
                                    {feature}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="auditorium-actions">
                    <Button onClick={() => navigate(`/auditorium/${auditorium.id}?view=true`)}>Details</Button>
                    <Button onClick={() => navigate(`/auditorium/${auditorium.id}?view=false`)} type="primary">
                        Book
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AuditoriumCard
