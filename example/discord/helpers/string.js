const shortenString = (str, maxLen) => {
    if (typeof str !== 'string' || str.length <= maxLen) return str
    
    return str.substr(0, maxLen) + '...'
}

module.exports = {
    shortenString: shortenString
}