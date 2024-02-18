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
    includes,
} = require("lodash")

const containsObject = (obj, list) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === obj) return true
    }
    return false
}

const getParameterCaseInsensitive = (object, key) => {
    const asLowercase = toLower(key)
    return object[Object.keys(object).find((k) => toLower(k) === asLowercase)]
}

const insertIf = (condition, arrayOrObj) => {
    if (Array.isArray(arrayOrObj)) return condition ? arrayOrObj : []
    if (isObject(arrayOrObj)) return condition ? arrayOrObj : {}
}

const isExist = (value, toCompareWith) => {
    if (typeof value !== "string") return false
    if (!["string", "array", "object"].includes(typeof toCompareWith)) return false
    if (typeof toCompareWith !== "string") return lowerCase(toCompareWith).includes(lowerCase(value))
    else return lowerCase(toCompareWith) === lowerCase(value)
}

const isObjectStrict = (variable) => typeof variable === "object" && variable !== null && !variable.length

const lowerCase = (value) => {
    return isArray(value)
        ? value.map((item) => toLower(item))
        : isObject(value)
        ? keys(value).map((item) => toLower(item))
        : toLower(value)
}

const monthToWeekYear = (months) => {
    return {
        weeks: round(months * 4.345, 2),
        years: round(months / 12, 2),
    }
}

const nRandomHexString = (length) => {
    if (isNaN(length)) return "Invalid Number"
    let result = ""
    const characters = "ABCDEF0123456789abcdef"
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length))
    return result
}

const nRandomNumber = (input) => {
    let randomNumber = ""
    if (typeof input !== "number") return 0
    input = Number(input)
    if (input <= 24) return 0
    for (let i = 0; i < input; i++) randomNumber += Math.floor(Math.random() * 10)
    return Number(randomNumber)
}

const pruneEmpty = (obj) => {
    return (function prune(current) {
        forOwn(current, function (value, key) {
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

const replaceAll = (string, toReplace, replacement) => {
    return string.replace(new RegExp(`${toReplace}`, "g"), replacement)
}

const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
}

const sanitizeFilename = (filename) => {
    let sanitizedFilename = filename
    sanitizedFilename = replaceAll(sanitizedFilename, " ", "_")
    sanitizedFilename = replaceAll(sanitizedFilename, "[()]", "")
    return sanitizedFilename
}

const settingsDiff = (newSettings, originalSettings, ignoreList = []) => {
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

        if (isObjectStrict(newSetting)) {
            if (!isEqual(originalSetting, newSetting)) changedSettings[setting] = newSetting
        } else if (isArray(newSetting)) {
            if (!isEqual(originalSetting, newSetting)) changedSettings[setting] = newSetting
        } else if (originalSetting !== newSetting) {
            changedSettings[setting] = newSetting
        }
    })
    return { changed: Object.keys(changedSettings).length > 0, changedSettings }
}

const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

const weekToMonthYear = (weeks) => {
    return {
        months: round(weeks / 4.345, 2),
        years: round(weeks / 52.143, 2),
    }
}

const yearToWeekMonth = (years) => {
    return {
        weeks: round(years * 52.143, 2),
        months: round(years * 12, 2),
    }
}

const compare = (valueA, valueB, strict = false) =>
    strict
        ? valueA?.toString() === valueB?.toString()
        : valueA?.toString()?.toLowerCase() === valueB?.toString()?.toLowerCase()

const isIncluded = (searchString, array, strict = false) =>
    includes(array, searchString, (item, search) => compare(item, search, strict))

const isAuthorized = (userRoles = [], rolesToCheck) => userRoles.some((role) => isIncluded(role, rolesToCheck))

module.exports = {
    containsObject,
    getParameterCaseInsensitive,
    insertIf,
    isExist,
    isObjectStrict,
    lowerCase,
    monthToWeekYear,
    nRandomHexString,
    nRandomNumber,
    pruneEmpty,
    replaceAll,
    round,
    sanitizeFilename,
    settingsDiff,
    toTitleCase,
    weekToMonthYear,
    yearToWeekMonth,
    compare,
    isIncluded,
    isAuthorized,
}
