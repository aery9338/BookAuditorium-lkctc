import React, { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { BiChevronDown, BiSolidPaperPlane } from "react-icons/bi"
import { HiPlus } from "react-icons/hi"
import { RiDeleteBin5Line } from "react-icons/ri"
import { Button, Card, Form, Image, Input, message, Modal, Select, Upload } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import { selectAllAuditoriums } from "reduxStore/selectors"
import { Features } from "utils/constants"

const AuditoriumTab = () => {
    const formRef = useRef()
    const auditoriums = useSelector(selectAllAuditoriums)
    const [openAuditoriumModal, setOpenAuditoriumModal] = useState(false)
    const [editAuditorium, setEditAuditorium] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [files, setFiles] = useState({ 0: {}, 1: {}, 2: {} })
    const [features, setFeatures] = useState([{ name: "", description: "" }])

    const onCloseModal = () => {
        setFiles({ 0: {}, 1: {}, 2: {} })
        setEditAuditorium(null)
        setOpenAuditoriumModal(false)
        setSelectedIndex(0)
    }

    const submitAuditoriumForm = () => {
        const fieldsError = formRef.current.getFieldsError()
        if (fieldsError?.some((field) => field?.errors?.length > 0))
            return message.warn("Fill all the details correctly")
        console.log("Submit data", files, formRef.current.getFieldsValue(), features, editAuditorium)
        console.log(
            "----1----",
            files?.map(async (file) => {})
        )
    }

    return (
        <div className="auditorium-wrapper">
            <div className="header-section">
                <div />
                <div>
                    <Button type="primary" onClick={() => setOpenAuditoriumModal(true)}>
                        <HiPlus size={20} /> &nbsp; Create new
                    </Button>
                </div>
            </div>
            <div className="list-container">
                {auditoriums?.length > 0 &&
                    auditoriums?.map((auditorium) => {
                        return (
                            <AuditoriumCard
                                key={auditorium._id}
                                onEdit={() => {
                                    setEditAuditorium({
                                        ...auditorium,
                                        block: auditorium.destination.block,
                                        floor: auditorium.destination.floor,
                                    })
                                    setFiles(
                                        auditorium?.images?.reduce((acc, fileURL, index) => {
                                            acc[index] = fileURL
                                            return acc
                                        }, files)
                                    )
                                    setFeatures(
                                        auditorium.features?.reduce((acc, item, index) => {
                                            acc[index] = item
                                            return acc
                                        }, {})
                                    )
                                    setOpenAuditoriumModal(true)
                                }}
                                auditorium={auditorium}
                            />
                        )
                    })}
            </div>
            {openAuditoriumModal && (
                <Modal
                    open={openAuditoriumModal}
                    title={`${editAuditorium?._id ? "Edit" : "Create"} auditorium`}
                    className="add-edit-auditorium-modal"
                    onOk={submitAuditoriumForm}
                    onCancel={onCloseModal}
                    okText={
                        <span>
                            {editAuditorium?._id ? "Update" : "Create"} &nbsp; <BiSolidPaperPlane size={20} />
                        </span>
                    }
                    destroyOnClose
                >
                    <div className="modal-container">
                        <div className="images-section">
                            <div className="main-image-frame hide-scrollbar">
                                <div className="main-image">
                                    {/* <div className="counter">{selectedIndex + 1}</div> */}
                                    {typeof files[selectedIndex] === "string" ? (
                                        <Image className="uploaded-image" preview={false} src={files[selectedIndex]} />
                                    ) : files[selectedIndex]?.type?.includes("image/") ? (
                                        <Image
                                            className="uploaded-image"
                                            preview={false}
                                            src={URL.createObjectURL(files[selectedIndex])}
                                        />
                                    ) : (
                                        <UploadComponent
                                            onChange={(file) =>
                                                setFiles((prevValues) => {
                                                    return { ...prevValues, [selectedIndex]: file }
                                                })
                                            }
                                        />
                                    )}
                                </div>
                                <div className="image-action-btn">
                                    {typeof files[selectedIndex] === "string" ||
                                    files[selectedIndex]?.type?.includes("image/") ? (
                                        <Button
                                            size="small"
                                            onClick={() =>
                                                setFiles((prevValues) => {
                                                    return { ...prevValues, [selectedIndex]: {} }
                                                })
                                            }
                                        >
                                            <RiDeleteBin5Line size={22} /> &nbsp; Remove
                                        </Button>
                                    ) : Object.keys(files).length > 3 ? (
                                        <Button
                                            size="small"
                                            onClick={() =>
                                                setFiles((prevValues) => {
                                                    const newData = {}
                                                    for (const key in prevValues) {
                                                        if (key < selectedIndex) {
                                                            newData[key] = prevValues[key]
                                                        } else if (key > selectedIndex) {
                                                            newData[key - 1] = prevValues[key]
                                                        }
                                                    }
                                                    if (selectedIndex + 1 === Object.keys(files).length) {
                                                        setSelectedIndex(selectedIndex - 1)
                                                    }
                                                    return newData
                                                })
                                            }
                                        >
                                            Delete
                                        </Button>
                                    ) : (
                                        <div />
                                    )}
                                    <Upload
                                        accept={".jpeg, .png, .jpg, .gif"}
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={(info) =>
                                            setFiles((prevValues) => {
                                                return { ...prevValues, [selectedIndex]: info?.file ?? {} }
                                            })
                                        }
                                    >
                                        <Button size="small" type="primary">
                                            {typeof files[selectedIndex] === "string" ||
                                            files[selectedIndex]?.type?.includes("image/")
                                                ? "Change"
                                                : "Upload"}
                                        </Button>
                                    </Upload>
                                </div>
                                <Form
                                    initialValues={editAuditorium}
                                    ref={formRef}
                                    layout="vertical"
                                    className="book-auditorium-form"
                                >
                                    {/*Title*/}
                                    <Form.Item
                                        required={true}
                                        label="Title:"
                                        name="title"
                                        rules={[{ required: true, message: "Please enter title" }]}
                                    >
                                        <Input placeholder="Title" />
                                    </Form.Item>
                                    {/*Description*/}
                                    <Form.Item
                                        required={true}
                                        label="Description:"
                                        name="description"
                                        rules={[{ required: true, message: "Please enter description" }]}
                                    >
                                        <Input.TextArea placeholder="Description" />
                                    </Form.Item>
                                    {/*Capacity*/}
                                    <Form.Item
                                        required={true}
                                        label="Capacity:"
                                        name="capacity"
                                        rules={[
                                            { required: true, message: "Please enter capacity" },
                                            { pattern: /^\d+$/, message: "capacity must be only numbers" },
                                        ]}
                                    >
                                        <Input type="number" placeholder="Capacity" />
                                    </Form.Item>
                                    {/*Block*/}
                                    <Form.Item required={true} label="Auditorium block:" name="block">
                                        <Input placeholder="Block" />
                                    </Form.Item>
                                    {/*Floor*/}
                                    <Form.Item required={true} label="Auditorium floor:" name="floor">
                                        <Input placeholder="Floor" />
                                    </Form.Item>
                                    {/*Features*/}
                                    <Form.Item label="Features">
                                        <div className="features-conatiner">
                                            {Object.values(features).map((feature, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="action">
                                                            <div className="counter">{index + 1}</div>
                                                            {Object.keys(features).length > 1 ? (
                                                                <Button
                                                                    size="small"
                                                                    onClick={() =>
                                                                        setFeatures((prevValues) => {
                                                                            const newData = {}
                                                                            for (const key in prevValues) {
                                                                                if (key < index) {
                                                                                    newData[key] = prevValues[key]
                                                                                } else if (key > index) {
                                                                                    newData[key - 1] = prevValues[key]
                                                                                }
                                                                            }
                                                                            return { ...newData }
                                                                        })
                                                                    }
                                                                >
                                                                    <RiDeleteBin5Line size={22} />
                                                                </Button>
                                                            ) : (
                                                                <div />
                                                            )}
                                                        </div>
                                                        <Select
                                                            onChange={(value) =>
                                                                setFeatures((prevValues) => {
                                                                    prevValues[index] = {
                                                                        ...prevValues[index],
                                                                        name: value,
                                                                    }
                                                                    return { ...prevValues }
                                                                })
                                                            }
                                                            value={feature?.name}
                                                            placeholder="Select features"
                                                            options={Object?.keys(Features)?.map((key) => {
                                                                return { value: key, label: Features[key] }
                                                            })}
                                                            suffixIcon={<BiChevronDown />}
                                                        />
                                                        <Input.TextArea
                                                            value={feature?.description}
                                                            onChange={({ target: { value } }) =>
                                                                setFeatures((prevValues) => {
                                                                    prevValues[index] = {
                                                                        ...prevValues[index],
                                                                        description: value,
                                                                    }
                                                                    return { ...prevValues }
                                                                })
                                                            }
                                                            placeholder="Description"
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="features-action">
                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={() =>
                                                    setFeatures((prevValue) => {
                                                        prevValue[Object.keys(prevValue).length] = {
                                                            name: null,
                                                            description: null,
                                                        }
                                                        return { ...prevValue }
                                                    })
                                                }
                                            >
                                                <HiPlus size={16} /> &nbsp; Add feature
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div className="secondary-images-container hide-scrollbar">
                                {Object.values(files)?.flatMap((file, index) => {
                                    if (index === selectedIndex) return []
                                    return (
                                        <div key={index} className="secondary-images-frame">
                                            <div className="counter">{index + 1}</div>
                                            <div onClick={() => setSelectedIndex(index)}>
                                                {typeof file === "string" ? (
                                                    <Image className="uploaded-image" preview={false} src={file} />
                                                ) : file?.type?.includes("image/") ? (
                                                    <Image
                                                        className="uploaded-image"
                                                        preview={false}
                                                        src={URL.createObjectURL(file)}
                                                    />
                                                ) : (
                                                    <Card className="upload-card">
                                                        <Image
                                                            className="upload-icon"
                                                            preview={false}
                                                            src={require("assets/images/Upload.png")}
                                                        />
                                                    </Card>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="secondary-images-frame">
                                    <div className="counter">
                                        <HiPlus size={16} />
                                    </div>
                                    <Card
                                        className="upload-card"
                                        onClick={() => {
                                            setFiles((prevValues) => {
                                                setSelectedIndex(Object.keys(prevValues).length)
                                                return { ...prevValues, [Object.keys(prevValues).length]: {} }
                                            })
                                        }}
                                    >
                                        <Image
                                            className="upload-icon"
                                            preview={false}
                                            src={require("assets/images/Upload.png")}
                                        />
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

const UploadComponent = ({ onChange }) => {
    return (
        <Upload
            accept={".jpeg, .png, .jpg, .gif"}
            showUploadList={false}
            beforeUpload={() => false}
            onChange={(info) => onChange(info?.file ?? null)}
        >
            <Card className="upload-card">
                <Image className="upload-icon" preview={false} src={require("assets/images/Upload.png")} />
                <p className="ant-upload-text">
                    Select a "JPG, PNG, JPEG or GIF" file to Upload <br />
                    or drag & drop it here
                </p>
            </Card>
        </Upload>
    )
}

export default AuditoriumTab
