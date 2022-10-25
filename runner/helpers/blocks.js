const axios = require("axios")

const getBlock = async ({
    endpoint,
    path,
    callback
}) => {
    try {
        const response = await axios.get(endpoint)
        callback(response.data[path])
    } catch (err) {
        console.error("Error fetching block:", err)
        return process.exit()
    }
}

module.exports = {
    getBlock
}