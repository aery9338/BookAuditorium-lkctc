import "./styles.scss"

const ButtonBase = ({ children, className, onClick = () => null, ...otherProps }) => {
    const createRippleEffect = (event) => {
        const buttonBase = event.currentTarget

        const circle = document.createElement("span")
        const diameter = Math.max(buttonBase.clientWidth, buttonBase.clientHeight)
        const radius = diameter / 2

        circle.style.width = circle.style.height = `${diameter}px`
        circle.style.left = `${event.clientX - buttonBase.getBoundingClientRect().left - radius}px`
        circle.style.top = `${event.clientY - buttonBase.getBoundingClientRect().top - radius}px`
        circle.classList.add("ripple")

        const ripple = buttonBase.querySelector(".ripple")
        buttonBase.appendChild(circle)
        if (ripple) ripple.remove()
    }

    return (
        <div
            className={`custom-ripple-div ${className}`}
            onClick={(event) => {
                createRippleEffect(event)
                onClick()
            }}
            {...otherProps}
        >
            {children}
        </div>
    )
}

export default ButtonBase
