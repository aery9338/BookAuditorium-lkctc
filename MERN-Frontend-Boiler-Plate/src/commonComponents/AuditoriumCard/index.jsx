import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MdOutlineLocationCity } from "react-icons/md"
import { MdOutlineOpenInNew } from "react-icons/md"
import { Button, Popconfirm } from "antd"
import { selectIsAdmin } from "reduxStore/selectors"
import { Features } from "utils/constants"
import "./styles.scss"

const AuditoriumCard = ({ auditorium, onEdit = () => null, onDelete = () => null }) => {
    const navigate = useNavigate()
    const isAdmin = useSelector(selectIsAdmin)

    return (
        <div className="auditorium-container">
            <div className={`image-container ${isAdmin ? "" : "show-preview"}`}>
                <img className="image" src={auditorium?.images?.[0]} alt={""} />
                <Button
                    onClick={() => navigate(`/auditorium/${auditorium.id}?view=true`)}
                    className="preview-image-main-action"
                    size="small"
                >
                    View &nbsp; <MdOutlineOpenInNew />
                </Button>
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
                                    {Features[feature?.name]}
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
                            onConfirm={onDelete}
                        >
                            <Button>Delete</Button>
                        </Popconfirm>
                        <Button onClick={onEdit} type="primary">
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
