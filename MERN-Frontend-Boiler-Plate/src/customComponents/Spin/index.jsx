import React from "react"
import Eclipse from "customComponents/Eclipse"
import { isString } from "lodash"
import PropTypes from "prop-types"
import "./styles.scss"

const sizeEnum = {
    LARGE: "large",
    DEFAULT: "default",
    SMALL: "small",
}

const validateProps = ({ size, className, label = "Loading", hideEclipse = false, ...props }) => {
    const width = Object.values(sizeEnum).includes(size) ? size : sizeEnum.DEFAULT
    return {
        className: isString(className) ? `loading-wrapper ${width} ${className}` : `loading-wrapper ${size}`,
        label: isString(label) ? (
            <div className="loading-text">
                {label?.trim()} {!hideEclipse && <Eclipse />}
            </div>
        ) : (
            label
        ),
        otherProps: props,
    }
}

const Spin = (props) => {
    const { className, label, otherProps } = validateProps(props)
    return (
        <div className={className} {...otherProps}>
            <div className="loader">
                <div className="outerCircle" />
                <div className="innerCircle" />
            </div>
            {label}
        </div>
    )
}

Spin.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.oneOf(Object.values(sizeEnum)),
}

export default Spin
