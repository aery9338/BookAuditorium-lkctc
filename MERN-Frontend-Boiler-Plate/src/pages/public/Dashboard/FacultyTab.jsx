import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BiChevronDown } from "react-icons/bi"
import { HiPlus } from "react-icons/hi"
import { Button, Flex, Form, Input, Modal, notification, Select, Tabs } from "antd"
import { configActions } from "reduxStore"
import { selectAllFaculties, selectIsAdmin } from "reduxStore/selectors"
import adminService from "services/adminService"
import { limits } from "utils"
import { UserRoles } from "utils/constants"
import { settingsDiff } from "utils/helper"

const FacultyTab = () => {
    const isAdmin = useSelector(selectIsAdmin)
    const dispatch = useDispatch()
    const faculties = useSelector(selectAllFaculties)
    const [form] = Form.useForm()

    const [openFacultyModal, setOpenFacultyModal] = useState(false)
    const [editFaculty, setEditFaculty] = useState({})
    const [isBtnLoading, setIsBtnLoading] = useState(false)

    const closeModal = () => {
        setEditFaculty({})
        setOpenFacultyModal(false)
        setIsBtnLoading(false)
    }
    const onFinishingCreatingSingleFaculty = async (values) => {
        const settingsDifferences = settingsDiff(values, editFaculty ?? {})
        if (settingsDifferences.changed) {
            const auditoriumId = editFaculty?._id ?? null
            const { error, message } = auditoriumId
                ? await adminService.updateAuditorium(auditoriumId, settingsDifferences.changedSettings)
                : await adminService.createAuditorium(settingsDifferences.changedSettings)
            if (!error) {
                notification.success({ message })
                dispatch(configActions.getConfigData())
            } else notification.error({ message })
        }
        closeModal()
    }

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
                            <CreateFaculty
                                form={form}
                                editFaculty={editFaculty}
                                isBtnLoading={isBtnLoading}
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
                                            <CreateFaculty
                                                form={form}
                                                isBtnLoading={isBtnLoading}
                                                onFinish={onFinishingCreatingSingleFaculty}
                                            />
                                        ),
                                        key: 0,
                                    },
                                    {
                                        label: "Upload",
                                        children: <></>,
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

const CreateFaculty = ({ form, editFaculty, onFinish, isBtnLoading }) => {
    return (
        <Form form={form} layout="vertical" className="faculty-form" onFinish={onFinish} initialValues={editFaculty}>
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
                <Input placeholder="Name" maxLength={limits.name.max} className="input-field" />
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
                <Input placeholder="E-mail address" maxLength={120} className="input-field" autoComplete="email" />
            </Form.Item>

            <Form.Item name="roles" hasFeedback rules={[{ required: true, message: "Please select faculty role" }]}>
                <Select
                    mode="multiple"
                    allowClear
                    name="role"
                    maxTagCount="responsive"
                    placeholder="Select roles"
                    options={Object?.keys(UserRoles)?.map((key) => {
                        return { value: key, label: UserRoles[key] }
                    })}
                    suffixIcon={<BiChevronDown />}
                />
            </Form.Item>

            <Flex gap="middle" justify="flex-end">
                <Button disabled={isBtnLoading}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={isBtnLoading}>
                    {editFaculty?._id ? "Update" : "Create"}
                </Button>
            </Flex>
        </Form>
    )
}
