import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd"
import { Spin } from "customComponents"
import _ from "lodash"
import { userActions } from "reduxStore"
import { selectIsLoggedIn, selectIsUserLoading } from "reduxStore/selectors"
import userAuthService from "services/userAuthService"
import { limits } from "utils"
import "./styles.scss"

const Signup = ({ onLogin = () => null, onAuthenticated = () => null }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const isUserLoading = useSelector(selectIsUserLoading)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        if (isLoggedIn) onAuthenticated()
        if (!isUserLoading) setLoading(false)
    }, [isLoggedIn, isUserLoading, onAuthenticated])

    // On form submission (success)
    const onFinish = (values) => {
        // TODO: validate values
        dispatch(userActions.signupUser(_.pick(values, ["username", "password", "email", "displayname"])))
    }

    // On form submission (failure)
    const onFinishFailed = ({ values }) => {}

    const getHintFromName = (name) => {
        return name?.replaceAll(" ", "_")?.replaceAll("-", "_")?.toLowerCase()
    }

    const getUsernameSuggestion = () => {
        let displayname = form.getFieldValue("displayname")
        let hint = getHintFromName(displayname) || ""
        if (hint && hint.match(limits.username.regex)) {
            form.setFields([
                {
                    name: "username",
                    value: hint,
                },
            ])
        }
    }

    return (
        <div className="signup-wrapper">
            {loading ? (
                <Spin />
            ) : (
                <div className="signup-card">
                    <span className="sub-title">Signup</span>

                    <Form
                        form={form}
                        layout="vertical"
                        className="signup-form"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        initialValues={{}}
                    >
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
                                onBlur={getUsernameSuggestion}
                                placeholder="Name"
                                maxLength={limits.name.max}
                                className="input-field"
                            />
                        </Form.Item>

                        {/*Username*/}
                        <Form.Item
                            name="username"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    pattern: limits.username.regex,
                                    async validator(rule, value) {
                                        if (rule?.required && !value) return Promise.reject("Enter a valid username")
                                        else if (!rule?.pattern?.exec(value))
                                            return Promise.reject(
                                                `Allowed characters are letters, numbers,
                                                        underscores, space and dash`
                                            )
                                        else if (rule?.pattern?.exec(value)) {
                                            const { error, message } = await userAuthService.checkUsername(value)
                                            if (error) return Promise.reject(message)
                                            else Promise.resolve(message)
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="Username" className="input-field" autoComplete="username" />
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
                                maxLength={120}
                                className="input-field"
                                autoComplete="email"
                            />
                        </Form.Item>

                        {/*Password*/}
                        <Form.Item
                            name="password"
                            hasFeedback
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (value.match(limits.password.regex)) {
                                            return Promise.resolve()
                                        } else {
                                            return Promise.reject(
                                                "Password should include at least one uppercase letter and one number."
                                            )
                                        }
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                maxLength={limits.password.max}
                                className="input-field"
                                autoComplete="new-password"
                            />
                        </Form.Item>

                        {/*Confirm Password*/}
                        <Form.Item
                            name="confirm"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                ({ getFieldValue }) => ({
                                    required: true,
                                    validator(rule, value) {
                                        if (getFieldValue("password") === value) return Promise.resolve()
                                        else if (!value) return Promise.reject("Enter the password to confirm")
                                        else return Promise.reject("The two passwords do not match!")
                                    },
                                }),
                            ]}
                        >
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                maxLength={limits.password.max}
                                className="input-field"
                            />
                        </Form.Item>

                        <Form.Item
                            name={"tosAccepted"}
                            valuePropName="checked"
                            validateTrigger={"onSubmit"}
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value)
                                            return Promise.reject("* Please review and accept the terms and conditions")
                                        return Promise.resolve()
                                    },
                                }),
                            ]}
                        >
                            <Checkbox className="checkbox-text">
                                I agree to the{" "}
                                <Typography.Link onClick={() => navigate("/legal/terms-of-service")}>
                                    <strong>Terms and conditions</strong>
                                </Typography.Link>{" "}
                                and{" "}
                                <Typography.Link onClick={() => navigate("/legal/privacy-policy")}>
                                    <strong>Privacy policy</strong>
                                </Typography.Link>
                            </Checkbox>
                        </Form.Item>

                        <Button
                            data-se="signup-button"
                            block
                            type="primary"
                            size="large"
                            className="auth-button"
                            htmlType="submit"
                            loading={isUserLoading}
                        >
                            Sign up
                        </Button>
                    </Form>
                    <Divider className="m-0" />
                    <div className="toggle-auth-action">
                        Already have an account ?
                        <Typography.Link onClick={onLogin}>
                            <strong>Log in</strong>
                        </Typography.Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Signup
