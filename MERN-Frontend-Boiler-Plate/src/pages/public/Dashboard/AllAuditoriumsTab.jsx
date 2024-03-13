import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BiChevronDown, BiSolidPaperPlane } from "react-icons/bi"
import { HiPlus } from "react-icons/hi"
import { RiDeleteBin5Line } from "react-icons/ri"
import { Button, Card, Form, Image, Input, Modal, notification, Select } from "antd"
import AuditoriumCard from "commonComponents/AuditoriumCard"
import Upload from "customComponents/Upload"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { configActions } from "reduxStore"
import { selectAllAuditoriums, selectIsAdmin } from "reduxStore/selectors"
import adminService from "services/adminService"
import { Features } from "utils/constants"
import { storage } from "utils/firebase"
import { settingsDiff } from "utils/helper"

const AllAuditoriumsTab = () => {
    const dispatch = useDispatch()
    const isAdmin = useSelector(selectIsAdmin)
    const auditoriums = useSelector(selectAllAuditoriums)
    const [openAuditoriumModal, setOpenAuditoriumModal] = useState(false)
    const [editAuditorium, setEditAuditorium] = useState(null)
    const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [files, setFiles] = useState({ 0: null, 1: null, 2: null })
    const [features, setFeatures] = useState([{ name: null, description: "" }])

    const closeModal = () => {
        setFiles({ 0: {}, 1: {}, 2: {} })
        setEditAuditorium({})
        setOpenAuditoriumModal(false)
        setSelectedIndex(0)
    }

    const onEditAuditorium = (auditorium) => {
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
    }

    const onDeleteAuditorium = async (auditoriumId) => {
        const { error, message } = await adminService.deleteAuditorium(auditoriumId)
        if (error) return notification.error({ message })
        notification.success({ message })
        dispatch(configActions.getConfigData())
    }

    const submitAuditoriumForm = async (values) => {
        setIsSubmitBtnLoading(true)
        try {
            const images = []
            const { title, description, block, floor, capacity } = values
            await Promise.all(
                Object.values(files)?.map(async (file) => {
                    try {
                        if (typeof file === "string") return images.push(file)
                        if (!file?.name) return null
                        const storageRef = ref(storage, "auditorium/" + file.name)
                        const res = await uploadBytes(storageRef, file)
                        if (!res?.metadata?.fullPath) return notification.error("File not uploaded")
                        const url = await getDownloadURL(ref(storage, "auditorium/" + file.name))
                        images.push(url)
                    } catch (error) {
                        console.error("Error info: ", error)
                    }
                })
            )

            const valuesToSubmit = {
                title,
                description,
                images,
                capacity,
                destination: { block, floor },
                features: Object.values(features)?.filter(({ name }) => !!name),
            }

            if (!images?.some((url) => url))
                return notification.error({ description: "Add at least 1 auditorium picture" })

            const settingsDifferences = settingsDiff(valuesToSubmit, editAuditorium ?? {})
            if (settingsDifferences.changed) {
                const auditoriumId = editAuditorium?._id ?? null
                const { error, message } = auditoriumId
                    ? await adminService.updateAuditorium(auditoriumId, settingsDifferences.changedSettings)
                    : await adminService.createAuditorium(settingsDifferences.changedSettings)
                if (!error) {
                    notification.success({ message })
                    dispatch(configActions.getConfigData())
                } else notification.error({ message })
            }
        } catch (error) {
            console.error("Error info: ", error)
        } finally {
            setIsSubmitBtnLoading(false)
            closeModal()
        }
    }

    return (
        <div className="all-auditoriums-wrapper">
            <div className="header-section">
                <div className="header">Auditorium ({auditoriums.length})</div>
                {isAdmin && (
                    <div className="action-button">
                        <Button type="primary" onClick={() => setOpenAuditoriumModal(true)}>
                            <HiPlus size={20} /> &nbsp; Create new
                        </Button>
                    </div>
                )}
            </div>
            <div className="list-container">
                {auditoriums?.length > 0 &&
                    auditoriums?.map((auditorium) => {
                        return (
                            <AuditoriumCard
                                key={auditorium._id}
                                view={"admin"}
                                onEdit={() => onEditAuditorium(auditorium)}
                                onDelete={() => onDeleteAuditorium(auditorium?._id)}
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
                    footer={null}
                    onCancel={closeModal}
                    destroyOnClose
                >
                    <div className="modal-container">
                        <Form
                            layout="vertical"
                            initialValues={editAuditorium}
                            onFinish={submitAuditoriumForm}
                            className="book-auditorium-form"
                        >
                            <div className="images-section">
                                <div className="main-image-frame hide-scrollbar">
                                    <div className="main-section">
                                        <div className="main-right-section">
                                            <div className="main-image">
                                                <div className="counter">{selectedIndex + 1}</div>
                                                <Upload
                                                    aspectRatio={1.4}
                                                    onChange={(files) =>
                                                        setFiles((prevValues) => {
                                                            return {
                                                                ...prevValues,
                                                                [selectedIndex]: files?.[0]?.file,
                                                            }
                                                        })
                                                    }
                                                >
                                                    {typeof files[selectedIndex] === "string" ? (
                                                        <Image
                                                            className="uploaded-image"
                                                            preview={false}
                                                            src={files[selectedIndex]}
                                                        />
                                                    ) : files[selectedIndex]?.type?.includes("image/") ? (
                                                        <Image
                                                            className="uploaded-image"
                                                            preview={false}
                                                            src={URL.createObjectURL(files[selectedIndex])}
                                                        />
                                                    ) : (
                                                        <Card className="upload-card">
                                                            <Image
                                                                className="upload-icon"
                                                                preview={false}
                                                                src={require("assets/images/Upload.png")}
                                                            />
                                                            <p className="ant-upload-text">
                                                                Select a "JPG, PNG, JPEG or GIF" file to Upload <br />
                                                                or drag & drop it here
                                                            </p>
                                                        </Card>
                                                    )}
                                                </Upload>
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
                                                        <RiDeleteBin5Line /> &nbsp; Remove
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
                                                    aspectRatio={1.4}
                                                    onChange={(files) =>
                                                        setFiles((prevValues) => {
                                                            return {
                                                                ...prevValues,
                                                                [selectedIndex]: files?.[0]?.file,
                                                            }
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
                                        </div>

                                        <div className="secondary-images-container hide-scrollbar">
                                            <div className="hide-scrollbar">
                                                {Object.values(files)?.flatMap((file, index) => {
                                                    if (index === selectedIndex) return []
                                                    return (
                                                        <div key={index} className="secondary-images-frame">
                                                            <div className="counter">{index + 1}</div>
                                                            <div onClick={() => setSelectedIndex(index)}>
                                                                {typeof file === "string" ? (
                                                                    <Image
                                                                        className="uploaded-image"
                                                                        preview={false}
                                                                        src={file}
                                                                    />
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
                                                                return {
                                                                    ...prevValues,
                                                                    [Object.keys(prevValues).length]: {},
                                                                }
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
                                    <Form.Item
                                        required={true}
                                        label="Auditorium block:"
                                        name="block"
                                        rules={[{ required: true, message: "Please enter auditorium block" }]}
                                    >
                                        <Input placeholder="Block" />
                                    </Form.Item>
                                    {/*Floor*/}
                                    <Form.Item
                                        required={true}
                                        label="Auditorium floor:"
                                        name="floor"
                                        rules={[{ required: true, message: "Please enter auditorium floor" }]}
                                    >
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
                                                                    <RiDeleteBin5Line />
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
                                </div>
                            </div>
                            <div className="footer">
                                <Button onClick={closeModal} disabled={isSubmitBtnLoading}>
                                    Cancel
                                </Button>
                                <Button htmlType="submit" type="primary" loading={isSubmitBtnLoading}>
                                    {editAuditorium?._id ? "Update" : "Create"} &nbsp; <BiSolidPaperPlane />
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default AllAuditoriumsTab
