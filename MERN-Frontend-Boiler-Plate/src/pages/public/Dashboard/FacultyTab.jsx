import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BiChevronDown, BiSolidEditAlt } from "react-icons/bi"
import { FaDeleteLeft } from "react-icons/fa6"
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
    Typography,
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
    const [selectedTab, setSelectedTab] = useState("single")
    const [isBtnLoading, setIsSubmitBtnLoading] = useState(false)

    const avatarColors = useMemo(() => {
        return Array.from({ length: faculties.length + 1 }, () => {
            return getRandomHexColor()
        })
    }, [faculties])

    const closeModal = () => {
        setEditFaculty(initialEmptyFacultyState)
        setSelectedFaculty(initialEmptyFacultyState)
        setOpenFacultyModal(false)
        setSelectedTab("single")
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
            setIsSubmitBtnLoading(true)
            const facultyId = editFaculty?._id ?? null
            const { error, message } = facultyId
                ? await adminService.updateFaculty(facultyId, settingsDifferences.changedSettings)
                : await adminService.createFaculty(settingsDifferences.changedSettings)
            if (!error) {
                notification.success({ description: message })
                dispatch(configActions.getConfigData())
            } else notification.error({ description: message })
            setIsSubmitBtnLoading(false)
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
                    title={`${editFaculty?._id ? "Edit" : "Add"} ${selectedTab === "bulk" ? "faculties" : "faculty"}`}
                    className={`add-edit-faculty-modal ${selectedTab === "bulk" ? "large-modal" : ""}`}
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
                                onChange={setSelectedTab}
                                activeKey={selectedTab}
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
                                        key: "single",
                                    },
                                    {
                                        label: "Upload",
                                        children: <UploadFacultyData onCancel={closeModal} />,
                                        key: "bulk",
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

const UploadFacultyData = ({ onCancel }) => {
    const dispatch = useDispatch()

    const [files, setFiles] = useState([])
    const [facultyData, setFacultyData] = useState([])
    const [editFaculty, setEditFaculty] = useState()
    const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false)

    useEffect(() => {
        onFileImport(files)
    }, [files])

    const saveBulkFaculty = async () => {
        setIsSubmitBtnLoading(true)
        const { error, message } = await adminService.createBulkFaculty({ data: facultyData })
        if (!error) notification.success({ description: message })
        else notification.error({ description: message })
        dispatch(configActions.getConfigData())
        setIsSubmitBtnLoading(false)
        onCancel()
    }

    const onFileImport = (files) => {
        setFiles(files)
        const facultyData = files.reduce((filteredData, { data, type, file }) => {
            if (type === "json" && Array.isArray(data))
                data?.forEach((faculty) => {
                    if ((isValidRegex(faculty.name, limits.name), faculty.email))
                        filteredData.push({
                            displayname: faculty.name,
                            email: faculty.email,
                            roles: (faculty.roles ?? "faculty")
                                ?.split(",")
                                ?.flatMap((role) => (UserRoles[role.trim()] ? role.trim() : [])),
                        })
                })
            else if (type === "excel" && Array.isArray(data))
                data?.forEach((sheet) => {
                    Object.values(sheet)
                        ?.flatMap((data) => (Array.isArray(data) ? data : []))
                        ?.forEach((faculty) => {
                            if ((isValidRegex(faculty.name, limits.name), faculty.email))
                                return filteredData.push({
                                    displayname: faculty.name,
                                    email: faculty.email,
                                    roles: (faculty.roles ?? "faculty")
                                        ?.split(",")
                                        ?.flatMap((role) => (UserRoles[role.trim()] ? role.trim() : [])),
                                })
                        })
                }, [])
            else message.error(`${file.name} is not compatible`)
            return filteredData
        }, [])
        setFacultyData(facultyData)
    }

    const avatarColors = useMemo(() => {
        return Array.from({ length: facultyData.length + 1 }, () => {
            return getRandomHexColor()
        })
    }, [facultyData])

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
            render: (_, facultyData, index) => {
                return (
                    <Flex gap="middle">
                        <Button type="ghost" onClick={() => setEditFaculty({ ...facultyData, _id: index + 1 })}>
                            <BiSolidEditAlt />
                        </Button>

                        <Button
                            type="ghost"
                            onClick={() => {
                                setFacultyData((prev) => {
                                    prev.splice(index, 1)
                                    return [...prev]
                                })
                            }}
                        >
                            <RiDeleteBin4Fill />
                        </Button>
                    </Flex>
                )
            },
        },
    ]

    return (
        <Flex className="bulk-container" gap={"middle"} vertical>
            <Flex flex={1} justify="center">
                <Upload
                    onChange={setFiles}
                    fileTypeName="JSON or Excel file"
                    accept=".json, .csv, .xls, .xlsx"
                    listType={"text"}
                />
            </Flex>

            <Flex gap={"large"} justify="space-between">
                <Button size="small" onClick={() => (files?.length === 0 ? onCancel() : setFiles([]))}>
                    {files?.length === 0 ? "Cancel" : "Reset"}
                </Button>
                <Upload
                    onChange={setFiles}
                    fileTypeName="JSON or excel file"
                    accept=".json, .csv, .xls, .xlsx"
                    listType={"text"}
                >
                    <Button size="small" type="primary">
                        Upload
                    </Button>
                </Upload>
            </Flex>

            <Flex vertical className="files-container" gap={"small"}>
                {files?.map(({ file: { name } }, index) => {
                    return (
                        <Flex
                            key={index}
                            gap={"large"}
                            align="center"
                            justify="space-between"
                            className="file-container"
                        >
                            <Flex gap={"middle"} align="center">
                                <div className="counter">{index + 1}</div>
                                <Typography className="file-name">{name}</Typography>
                            </Flex>
                            <Button
                                type="ghost"
                                onClick={() => {
                                    setFiles((prev) => {
                                        prev.splice(index, 1)
                                        return [...prev]
                                    })
                                }}
                            >
                                <FaDeleteLeft className="file-action" />
                            </Button>
                        </Flex>
                    )
                })}
            </Flex>

            <Table pagination={false} dataSource={facultyData} columns={columns} />

            <Flex justify="space-between" gap={"middle"} align="center">
                <Typography className="total-faculty-number">Total: {facultyData?.length}</Typography>
                <Flex gap={"middle"}>
                    <Button onClick={onCancel} disabled={isSubmitBtnLoading}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={saveBulkFaculty} loading={isSubmitBtnLoading}>
                        Save
                    </Button>
                </Flex>
            </Flex>

            <Modal
                open={!!editFaculty?._id}
                title={`Edit faculty`}
                className={`add-edit-faculty-modal`}
                footer={null}
                onCancel={() => setEditFaculty()}
                destroyOnClose
            >
                <CreateEditFaculty
                    setFacultyValue={(key, value) =>
                        setEditFaculty((prevValue) => {
                            return { ...prevValue, [key]: value }
                        })
                    }
                    editFaculty={editFaculty}
                    onCancel={() => setEditFaculty()}
                    onFinish={() => {
                        const index = editFaculty._id - 1
                        delete editFaculty._id
                        setFacultyData((prev) => {
                            prev.splice(index, 1, editFaculty)
                            return [...prev]
                        })
                        setEditFaculty()
                    }}
                />
            </Modal>
        </Flex>
    )
}
