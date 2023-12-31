const {
    isUndefined,
    isNull,
    isNaN,
    isString,
    isArray,
    isEmpty,
    isObject,
    isEqual,
    keys,
    toLower,
    cloneDeep,
    pull,
    forOwn,
    isNumber,
    trim,
    isBoolean,
} = require("lodash")

export const containsObject = (obj, list) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === obj) return true
    }
    return false
}

export const getParameterCaseInsensitive = (object, key) => {
    const asLowercase = toLower(key)
    return object[Object.keys(object).find((k) => toLower(k) === asLowercase)]
}

export const insertIf = (condition, arrayOrObj) => {
    if (Array.isArray(arrayOrObj)) return condition ? arrayOrObj : []
    if (isObject(arrayOrObj)) return condition ? arrayOrObj : {}
}

export const trueValues = ["true", "yes", "1"]

export const toLowerCaseTrimedString = (value) => trim(value?.toString()?.toLowerCase())

export const isStringNumberBoolean = (value) => isString(value) || isNumber(value) || isBoolean(value)

export const sortObjectKeys = (obj) => {
    const sortedKeys = Object.keys(obj).sort()
    const sortedObj = {}
    for (const key of sortedKeys) {
        sortedObj[key] = obj[key]
    }
    return sortedObj
}

export const isEqualValue = (valueA, valueB, findDifference = false) => {
    valueA = isStringNumberBoolean(valueA) ? toLowerCaseTrimedString(valueA) : valueA
    valueB = isStringNumberBoolean(valueB) ? toLowerCaseTrimedString(valueB) : valueB

    const typeOfA = typeof valueA
    const typeOfB = typeof valueB
    if (typeOfA !== typeOfB) return false

    if (!findDifference) {
        if (isString(valueA)) return valueA === valueB
        if (isStrictObject(valueA)) {
            for (const key in valueA) {
                const objValueA = valueA[key]
                const objValueB = valueB[key]
                if (!isEqualValue(objValueA, objValueB)) return false
            }
            return true
        }
        if (isArray(valueA)) {
            if (valueA.length !== valueB.length) return false
            else
                return (
                    valueA.filter((obj1) => !!valueB.filter((obj2) => isEqualValue(obj1, obj2)).length).length ===
                    valueB.length
                )
        }
    }
    return false
}

export const isStrictObject = (variable) => isObject(variable) && variable !== null && !variable.length

export const lowerCase = (value) => {
    return isArray(value)
        ? value.map((item) => toLower(item))
        : isObject(value)
        ? keys(value).map((item) => toLower(item))
        : toLower(value)
}

export const monthToWeekYear = (months) => {
    return {
        weeks: round(months * 4.345, 2),
        years: round(months / 12, 2),
    }
}

export const nRandomHexString = (length) => {
    if (isNaN(length)) return "Invalid Number"
    let result = ""
    const characters = "ABCDEF0123456789abcdef"
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length))
    return result
}

export const nRandomNumber = (input) => {
    let randomNumber = ""
    input = Number(input)
    if (!isNumber(input)) return 0
    if (input <= 24) return 0
    for (let i = 0; i < input; i++) randomNumber += Math.floor(Math.random() * 10)
    return Number(randomNumber)
}

export const pruneEmpty = (obj) => {
    return (function prune(current) {
        forOwn(current, (value, key) => {
            if (
                isUndefined(value) ||
                isNull(value) ||
                isNaN(value) ||
                value === 0 ||
                (isString(value) && isEmpty(value)) ||
                (isObject(value) && isEmpty(prune(value)))
            ) {
                delete current[key]
            }
        })
        if (isArray(current)) pull(current, undefined)
        return current
    })(cloneDeep(obj))
}

export const replaceAll = (string, toReplace, replacement) => {
    return string.replace(new RegExp(`${toReplace}`, "g"), replacement)
}

export const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
}

export const sanitizeFilename = (filename) => {
    let sanitizedFilename = filename
    sanitizedFilename = replaceAll(sanitizedFilename, " ", "_")
    sanitizedFilename = replaceAll(sanitizedFilename, "[()]", "")
    return sanitizedFilename
}

export const settingsDiff = (newSettings, originalSettings, ignoreList = []) => {
    // ignore_list takes a list of (str) keys to ignore
    // Returns an object with the keys/values that have changed from their initial state
    let _newSettings = cloneDeep(newSettings)
    let _originalSettings = cloneDeep(originalSettings)
    // Deleting ignored fields
    ignoreList.forEach((ignore_attribute) => {
        delete _newSettings[ignore_attribute]
        delete _originalSettings[ignore_attribute]
    })
    // calculating changed settings
    let changedSettings = {}
    Object.keys(_newSettings).forEach((setting) => {
        let newSetting = _newSettings[setting]
        let originalSetting = _originalSettings[setting]

        if (isStrictObject(newSetting)) {
            if (!isEqual(originalSetting, newSetting)) changedSettings[setting] = newSetting
        } else if (isArray(newSetting)) {
            if (!isEqual(originalSetting, newSetting)) changedSettings[setting] = newSetting
        } else if (originalSetting !== newSetting) {
            changedSettings[setting] = newSetting
        }
    })
    return { changed: Object.keys(changedSettings).length > 0, changedSettings }
}

export const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

export const weekToMonthYear = (weeks) => {
    return {
        months: round(weeks / 4.345, 2),
        years: round(weeks / 52.143, 2),
    }
}

export const yearToWeekMonth = (years) => {
    return {
        weeks: round(years * 52.143, 2),
        months: round(years * 12, 2),
    }
}

export const getExpiryDate = (validity_days) => {
    validity_days = isNumber(validity_days) ? validity_days : 30
    const daysInMiliseconds = validity_days * 1000 * 60 * 60 * 24
    return new Date(new Date().getTime() + daysInMiliseconds)
}

export const ObjectId = (m = Math, d = Date, h = 16, s = (s) => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h))

export const isComponent = (component) => component?.$$typeof === Symbol?.for("react.element")

export const htmlTagsRegex = /<[^>]+>|\s+/g

export const processHtmlString = (string, extractBodyContent = false) => {
    if (extractBodyContent) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(string, "text/html")
        return doc?.body?.textContent?.replace(htmlTagsRegex, " ")
    } else {
        return string.replace(htmlTagsRegex, "")
    }
}

export const isAuthrized = (rolesToCheck, userRoles) => userRoles.some((role) => rolesToCheck.includes(role?.rolename))

export const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const queryParams = {}
    for (let param of searchParams.entries()) {
        const [key, value] = param
        queryParams[key] = value
    }
    return queryParams
}

export const compare = (valueA, valueB, strict = false) => {
    return strict
        ? valueA?.toString() === valueB?.toString()
        : valueA?.toString()?.toLowerCase() === valueB?.toString()?.toLowerCase()
}
