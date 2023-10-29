const age = {
    min: 18,
    max: 110,
}

const name = {
    min: 2,
    max: 30,
    regex: new RegExp("^[a-zA-Z0-9][a-zA-Z0-9_\\s&#@!$.-]+[a-zA-Z0-9]$"),
}

const password = {
    min: 8,
    max: 64,
    regex: new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])\\S{8,}$"),
}

const username = {
    min: 3,
    max: 30,
    regex: new RegExp("^(?!.*__.*)[a-zA-Z0-9][a-zA-Z0-9_]+[a-zA-Z0-9]$"),
}

module.exports = {
    age,
    name,
    password,
    username,
}
