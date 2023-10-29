import { isNumber, isObject, isString } from "lodash"
import PropTypes from "prop-types"
import "./styles.scss"

const validateProps = ({ className, style, count, animationDelay, animationDuration, gap, ...props }) => {
    return {
        className: isString(className) ? `eclipse-wrapper ${className}` : "eclipse-wrapper",
        style: isObject(style) ? { ...style } : {},
        count: isNumber(count) ? count : 3,
        gap: isNumber(gap) ? gap : 4,
        animationDelay: isNumber(animationDelay) ? animationDelay : 0.3,
        animationDuration: isNumber(animationDuration) ? animationDuration : 2,
        otherProps: props,
    }
}

const Eclipse = (props) => {
    const { className, style, count, gap, animationDelay, animationDuration, otherProps } = validateProps(props)
    let dots = []
    for (let i = 0; i < count; i++) {
        dots.push(
            <div
                key={i}
                className="dot"
                style={{
                    marginRight: gap,
                    animationDuration: `${animationDuration}s`,
                    animationDelay: `${animationDelay * i}s`,
                    ...style,
                }}
            ></div>
        )
    }

    return (
        <div className={className} {...otherProps}>
            {dots}
        </div>
    )
}

Eclipse.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    count: PropTypes.number,
    gap: PropTypes.number,
    animationDelay: PropTypes.number,
    animationDuration: PropTypes.number,
}

export default Eclipse
