import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MdOutlineLocationCity } from "react-icons/md"
import { MdOutlineOpenInNew } from "react-icons/md"
import { PiMicrophoneStageThin, PiTelevisionDuotone } from "react-icons/pi"
import { RiProjector2Fill } from "react-icons/ri"
import { Button, Popconfirm, Tooltip, Typography } from "antd"
import { selectIsAdmin } from "reduxStore/selectors"
import "./styles.scss"

const AuditoriumCard = ({ auditorium, onEdit = () => null, onDelete = () => null }) => {
    const navigate = useNavigate()
    const isAdmin = useSelector(selectIsAdmin)

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
                    {auditorium?.features?.length > 0 &&
                        auditorium?.features?.map((feature, index) => {
                            let includesTv = false
                            let includesMic = false
                            let includesProjector = false

                            if (!includesTv && ["tv", "television", "smart tv"]?.includes(feature?.name?.toLowerCase()))
                                includesTv = true
                            if (!includesMic && ["mic", "microphone"]?.includes(feature?.name?.toLowerCase()))
                                includesMic = true
                            if (!includesProjector && ["projector"]?.includes(feature?.name?.toLowerCase()))
                                includesProjector = true

                            if (includesTv || includesMic || includesProjector) return null
                            return (
                                <Tooltip
                                    key={index}
                                    title={
                                        <Typography className="preview-image-action-tooltip-title">
                                            Includes {feature?.name}
                                        </Typography>
                                    }
                                    placement="right"
                                >
                                    <Button className="preview-action" size="small">
                                        {includesMic.includes(feature?.name?.toLowerCase()) ? (
                                            <PiMicrophoneStageThin />
                                        ) : includesProjector ? (
                                            <RiProjector2Fill />
                                        ) : includesTv ? (
                                            <PiTelevisionDuotone />
                                        ) : (
                                            <></>
                                        )}
                                    </Button>
                                </Tooltip>
                            )
                        })}
                </div>
            </div>
            <div className="auditorium-content">
                <div className="auditorium-details">
                    <div className="title">{auditorium?.title}</div>
                    <div className="sub-title overflow-ellipsis">{auditorium?.description}</div>
                    <div className="description">
                        <MdOutlineLocationCity /> &nbsp; {auditorium?.destination?.block}
                        {auditorium?.destination?.block && auditorium?.destination?.floor && ", "}
                        {auditorium?.destination?.floor}
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
                        <Popconfirm
                            title={`Are you sure you want to delete ${auditorium.title}`}
                            okText="Delete"
                            onConfirm={() => onDelete(auditorium._id)}
                        >
                            <Button>Delete</Button>
                        </Popconfirm>
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
        </div>
    )
}

export default AuditoriumCard
