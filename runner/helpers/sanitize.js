const cleanString = (str) => {
    if (typeof str !== 'string') return str
    
    return str.replace(/[^a-zA-Z0-9 -]/g, '')
}

const shortenString = (str, maxLen) => {
    if (typeof str !== 'string' || str.length <= maxLen) return str
    
    return str.substr(0, maxLen) + '...'
}

module.exports = {
    cleanString: cleanString,
    shortenString: shortenString
}