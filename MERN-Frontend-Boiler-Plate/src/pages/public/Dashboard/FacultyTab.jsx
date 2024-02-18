import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BiChevronDown, BiSolidEditAlt } from "react-icons/bi"
import { HiPlus } from "react-icons/hi"
import { RiDeleteBin4Fill } from "react-icons/ri"
import {
    Avatar,
    Button,
    Flex,
    Form,
    Input,
    message,
    Modal,
    notification,
    Popconfirm,
    Select,
    Table,
    Tabs,
    Tooltip,
} from "antd"
import Upload from "customComponents/Upload"
import { configActions } from "reduxStore"
import { selectAllFaculties, selectIsAdmin, selectUserData } from "reduxStore/selectors"
import adminService from "services/adminService"
import { constants, limits } from "utils"
import { getFirstLetters, getRandomHexColor, settingsDiff } from "utils/helper"

const { UserRoles } = constants
const { isValidRegex } = limits

const initialEmptyFacultyState = {
    displayname: "",
    email: "",
    roles: [],
}

const FacultyTab = () => {
    const isAdmin = useSelector(selectIsAdmin)
    const userData = useSelector(selectUserData)
    const dispatch = useDispatch()
    const faculties = useSelector(selectAllFaculties)

    const [openFacultyModal, setOpenFacultyModal] = useState(false)
    const [editFaculty, setEditFaculty] = useState(initialEmptyFacultyState)
    const [selectedFaculty, setSelectedFaculty] = useState(initialEmptyFacultyState)
    const [isBtnLoading, setIsBtnLoading] = useState(false)

    const avatarColors = useMemo(() => {
        return Array.from({ length: faculties.length + 1 }, () => {
            return getRandomHexColor()
        })
    }, [faculties])

    const closeModal = () => {
        setEditFaculty(initialEmptyFacultyState)
        setSelectedFaculty(initialEmptyFacultyState)
        setOpenFacultyModal(false)
        setIsBtnLoading(false)
    }

    const onDelete = async (facultyId) => {
        const { error, message } = await adminService.deleteFaculty(facultyId)
        if (error) return notification.error({ message })
        notification.success({ description: message })
        dispatch(configActions.getConfigData())
    }

    const onFinishingCreatingSingleFaculty = async () => {
        const settingsDifferences = settingsDiff(editFaculty, selectedFaculty)
        if (settingsDifferences.changed) {
            const auditoriumId = editFaculty?._id ?? null
            const { error, message } = auditoriumId
                ? await adminService.updateFaculty(auditoriumId, settingsDifferences.changedSettings)
                : await adminService.createFaculty(settingsDifferences.changedSettings)
            if (!error) {
                notification.success({ description: message })
                dispatch(configActions.getConfigData())
            } else notification.error({ description: message })
        }
        closeModal()
    }

    const columns = [
        {
            title: <Flex />,
            dataIndex: "displayname",
            key: "key",
            render: (displayname, _, index) => {
                return <Avatar style={avatarColors[index]}>{getFirstLetters(displayname)}</Avatar>
            },
        },
        {
            title: "Name",
            dataIndex: "displayname",
            key: "displayname",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "roles",
            key: "roles",
            render: (_, { roles }) => {
                return roles?.map((role) => UserRoles[role])?.join(", ")
            },
        },
        {
            title: "Action",
            dataIndex: "-",
            key: "action",
            render: (_, faculty) => {
                const isSelf = (faculty._id === userData._id) & false
                return (
                    <Flex gap="middle">
                        <Tooltip arrow={false} title={isSelf ? "You can't make changes to your own account" : ""}>
                            <Button
                                disabled={isSelf}
                                type="ghost"
                                onClick={() => {
                                    setEditFaculty(faculty)
                                    setSelectedFaculty(faculty)
                                    setOpenFacultyModal(true)
                                }}
                            >
                                <BiSolidEditAlt />
                            </Button>
                        </Tooltip>
                        <Tooltip arrow={false} title={isSelf ? "You can't make changes to your own account" : ""}>
                            <Popconfirm
                                title={`Are you sure you want to delete ${faculty.displayname}`}
                                okText="Delete"
                                onConfirm={() => onDelete(faculty._id)}
                            >
                                <Button type="ghost" disabled={isSelf}>
                                    <RiDeleteBin4Fill />
                                </Button>
                            </Popconfirm>
                        </Tooltip>
                    </Flex>
                )
            },
        },
    ]

    return (
        <Flex className="faculty-wrapper">
            <Flex className="header-section">
                <Flex className="header">Faculty members ({faculties.length})</Flex>
                {isAdmin && (
                    <Flex className="action-button">
                        <Button type="primary" onClick={() => setOpenFacultyModal(true)}>
                            <HiPlus size={20} /> &nbsp; Add faculty
                        </Button>
                    </Flex>
                )}
            </Flex>
            <Flex className="faculties-container">
                <Table pagination={false} dataSource={faculties} columns={columns} />
            </Flex>
            {openFacultyModal && (
                <Modal
                    open={openFacultyModal}
                    title={`${editFaculty?._id ? "Edit" : "Create"} faculty`}
                    className="add-edit-faculty-modal"
                    footer={null}
                    onCancel={closeModal}
                    destroyOnClose
                >
                    <Flex className="faculty-tab">
                        {editFaculty?._id ? (
                            <CreateEditFaculty
                                setFacultyValue={(key, value) =>
                                    setEditFaculty((prevValue) => {
                                        return { ...prevValue, [key]: value }
                                    })
                                }
                                editFaculty={editFaculty}
                                isBtnLoading={isBtnLoading}
                                onCancel={closeModal}
                                onFinish={onFinishingCreatingSingleFaculty}
                            />
                        ) : (
                            <Tabs
                                type="card"
                                centered
                                defaultActiveKey={"create"}
                                className="custom-tab"
                                items={[
                                    {
                                        label: "Create",
                                        children: (
                                            <CreateEditFaculty
                                                setFacultyValue={(key, value) =>
                                                    setEditFaculty((prevValue) => {
                                                        return { ...prevValue, [key]: value }
                                                    })
                                                }
                                                onCancel={closeModal}
                                                isBtnLoading={isBtnLoading}
                                                onFinish={onFinishingCreatingSingleFaculty}
                                            />
                                        ),
                                        key: 0,
                                    },
                                    {
                                        label: "Upload",
                                        children: <UploadFacultyData />,
                                        key: 1,
                                    },
                                ]}
                            />
                        )}
                    </Flex>
                </Modal>
            )}
        </Flex>
    )
}

export default FacultyTab

const CreateEditFaculty = ({ editFaculty = {}, setFacultyValue, onFinish, isBtnLoading, onCancel }) => {
    return (
        <Form layout="vertical" className="faculty-form" onFinish={onFinish} initialValues={editFaculty}>
            {/*Name*/}
            <Form.Item
                name="displayname"
                hasFeedback
                rules={[
                    {
                        required: true,
                        pattern: limits.name.regex,
                        validator(rule, value) {
                            if (rule?.required && !value) return Promise.reject("Enter a valid name")
                            else if (!rule?.pattern?.exec(value))
                                return Promise.reject(
                                    `Allowed characters are letters, numbers, 
                                    underscores, space and dash`
                                )
                            return Promise.resolve()
                        },
                    },
                ]}
            >
                <Input
                    placeholder="Name"
                    value={editFaculty.displayname}
                    onChange={({ target: { value } }) => setFacultyValue("displayname", value)}
                    maxLength={limits.name.max}
                    className="input-field"
                />
            </Form.Item>

            {/*Email*/}
            <Form.Item
                name="email"
                hasFeedback
                rules={[
                    { required: true, message: "Please enter your email address" },
                    { type: "email", message: "Please enter your email address" },
                ]}
            >
                <Input
                    placeholder="E-mail address"
                    readOnly={editFaculty._id}
                    maxLength={120}
                    value={editFaculty.email}
                    onChange={({ target: { value } }) => setFacultyValue("email", value)}
                    className="input-field"
                    autoComplete="email"
                />
            </Form.Item>

            <Form.Item name="roles" hasFeedback rules={[{ required: true, message: "Please select faculty role" }]}>
                <Select
                    mode="multiple"
                    allowClear
                    name="role"
                    value={editFaculty.roles}
                    onChange={(value) => setFacultyValue("roles", value)}
                    maxTagCount="responsive"
                    placeholder="Select roles"
                    options={Object?.keys(UserRoles)?.map((key) => {
                        return { value: key, label: UserRoles[key] }
                    })}
                    suffixIcon={<BiChevronDown />}
                />
            </Form.Item>

            <Flex gap="middle" justify="flex-end">
                <Button disabled={isBtnLoading} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={isBtnLoading}>
                    {editFaculty?._id ? "Update" : "Create"}
                </Button>
            </Flex>
        </Form>
    )
}

const UploadFacultyData = () => {
    const [files, setFiles] = useState([])

    const facultyData = useMemo(() => {
        return files.reduce((filteredData, { data, type, file }) => {
            if (type === "json" && Array.isArray(data))
                data?.forEach((faculty) => {
                    if ((isValidRegex(faculty.name, limits.name), faculty.email))
                        filteredData.push({
                            ...faculty,
                            roles: (faculty.roles ?? "faculty")
                                ?.split(",")
                                ?.flatMap((role) => (UserRoles[role.trim()] ? role.trim() : [])),
                        })
                })
            else if (type === "excel" && Array.isArray(data))
                data?.reduce((sheetsData, sheet) => {
                    const filteredSheetData = Object.values(sheet)
                    console.log(filteredSheetData)
                    return sheetsData
                }, [])?.forEach((faculty) => {
                    if ((isValidRegex(faculty.name, limits.name), faculty.email))
                        filteredData.push({
                            ...faculty,
                            roles: (faculty.roles ?? "faculty")
                                ?.split(",")
                                ?.flatMap((role) => (UserRoles[role.trim()] ? role.trim() : [])),
                        })
                })
            else message.error(`${file.name} is not compatible`)
            return filteredData
        }, [])
    }, [files])

    console.log({ files, facultyData })

    return (
        <Flex className="bulk-container">
            <Upload
                onChange={setFiles}
                fileTypeName="JSON or excel file"
                accept=".json, .csv, .xls, .xlsx"
                listType={"text"}
            />
        </Flex>
    )
}
