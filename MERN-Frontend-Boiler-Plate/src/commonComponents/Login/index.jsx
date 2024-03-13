import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
    Button,
    Flex,
    // Divider,
    Form,
    Input,
    notification,
    Tooltip,
    // Typography,
} from "antd"
import { Spin } from "customComponents"
import _ from "lodash"
// import GoogleAuth from "components/Google-Auth"
import { userActions } from "reduxStore"
import { selectIsLoggedIn, selectIsUserLoading } from "reduxStore/selectors"
import "./styles.scss"

const Login = () => {
    const navigate = useNavigate()
    const isUserLoading = useSelector(selectIsUserLoading)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [loading, setLoading] = React.useState(true)
    const dispatch = useDispatch()

    const onAuthenticated = () => navigate("/")

    useEffect(() => {
        if (isLoggedIn) onAuthenticated()
        if (!isUserLoading) setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, isUserLoading])

    // On form submission (success)
    const onFinish = (values) => {
        dispatch(userActions.loginUser(_.pick(values, ["username", "password"])))
    }

    // On form submission (failure)
    const onFinishFailed = ({ values }) => {
        notification.error({ description: "Error in submitting values" })
    }

    return (
        <div className="login-wrapper">
            {loading ? (
                <Spin />
            ) : (
                <div className="login-card">
                    <span className="sub-title">Login</span>

                    {/* <GoogleAuth />

                    <Divider plain className="divider-text text-muted m-0">
                        or login with your email
                    </Divider> */}

                    <Form layout="vertical" className="login-form" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        {/*Email*/}
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Please enter your email address correctly",
                                },
                            ]}
                        >
                            <Input placeholder="E-mail address" maxLength={120} className="input-field" />
                        </Form.Item>

                        {/*Password*/}
                        <Form.Item name="password" rules={[{ required: true, message: "Please enter your password" }]}>
                            <Flex align="center" gap={"middle"}>
                                <Input.Password type="password" placeholder="Password" className="input-field" />
                                {/*Forgot password button*/}
                                <Tooltip placement="bottom" title="Coming soon">
                                    <Button type="link" onClick={() => null} style={{ paddingRight: 0 }}>
                                        Forgot?
                                    </Button>
                                </Tooltip>
                            </Flex>
                        </Form.Item>

                        <Button
                            data-se="login-button"
                            type="primary"
                            className="auth-button"
                            htmlType="submit"
                            size="large"
                            loading={isUserLoading}
                            block
                        >
                            Login
                        </Button>
                    </Form>
                    {/* <Divider className="m-0" /> */}
                    {/* <div className="toggle-auth-action">
                        Don't have an account ?<Typography.Link onClick={onSignup}>Create account</Typography.Link>
                    </div> */}
                </div>
            )}
        </div>
    )
}

export default Login
