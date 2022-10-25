const cleanString = (str) => {
    return str.replace(/[^a-zA-Z0-9 -]/g, '')
}

module.exports = cleanString