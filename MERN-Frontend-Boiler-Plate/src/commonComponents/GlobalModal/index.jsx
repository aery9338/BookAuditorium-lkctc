import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Modal } from "antd"
import Login from "components/Login"
import Signup from "components/Signup"
import { globalModalActions } from "reduxStore"
import { selectGlobalModal } from "reduxStore/globalModal/selectors"

const GlobalModal = () => {
    const dispatch = useDispatch()
    const globalModalData = useSelector(selectGlobalModal)
    const { isOpen, modalType } = globalModalData

    const onClose = useCallback(() => dispatch(globalModalActions.setState({ isOpen: false })), [dispatch])

    const renderModalContent = () => {
        switch (modalType) {
            case "Login":
                return (
                    <Login
                        onSignup={() => dispatch(globalModalActions.setState({ isOpen: true, modalType: "Signup" }))}
                    />
                )
            case "Signup":
                return <Signup />
            default:
                return null
        }
    }

    return (
        <Modal open={isOpen} onCancel={onClose} footer={false}>
            {renderModalContent()}
        </Modal>
    )
}

export default GlobalModal
