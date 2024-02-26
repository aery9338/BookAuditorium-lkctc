import { BsFillMusicPlayerFill } from "react-icons/bs"
import { FaMicrophoneAlt } from "react-icons/fa"
import { GiMicrophone } from "react-icons/gi"
import { PiTelevision } from "react-icons/pi"
import { RiProjector2Fill } from "react-icons/ri"

export const DocumentStatus = Object.freeze({
    NORMAL: "normal",
    DELETED: "deleted",
    FLAGGED: "flagged",
})

export const Gender = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
})

export const Status = Object.freeze({
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
})

export const Length = Object.freeze({
    CM: "cm",
    IN: "in",
})

export const Time = Object.freeze({
    SECONDS: "s",
    MINUTES: "m",
    HOURS: "h",
    DAYS: "days",
    MONTHS: "months",
    YEARS: "years",
})

export const Weight = Object.freeze({
    KG: "kg",
    LB: "lb",
})

export const Departments = Object.freeze({
    it: "Information Technology",
    management: "Management",
    other: "Other",
})

export const Occasions = Object.freeze({
    official: "Official",
    meeting: "Meeting",
    program: "Program",
    practice: "Practice",
    function: "Function",
    seminar: "Seminar",
    other: "Other",
})

export const Features = Object.freeze({
    mic: "Mic",
    wirelessMic: "Wireless Mic",
    projector: "Projector",
    smartTV: "Smart TV",
    soundBox: "Sound Box",
})

export const FeaturesDescription = Object.freeze({
    mic: "Enhance auditorium events with professional microphones.",
    wirelessMic: "Enhance auditorium events with professional microphones.",
    projector: "Elevate presentations with a high-quality auditorium projector.",
    smartTV: "Experience brilliance with Smart TVs in this auditorium.",
    soundBox: "Sound Box",
})

export const FeaturesIcon = Object.freeze({
    mic: <FaMicrophoneAlt />,
    wirelessMic: <GiMicrophone />,
    projector: <RiProjector2Fill />,
    smartTV: <PiTelevision />,
    soundBox: <BsFillMusicPlayerFill />,
})

export const UserRoles = Object.freeze({
    admin: "Admin",
    faculty: "Faculty",
    staff: "Staff",
})
