const EventEmitter = require("events")
const axios = require("axios")

class Poll extends EventEmitter {
    started = false;
    lastBlock = 0;
    pollInterval;

    constructor({
        endpoint,
        interval = 1000,
        path
    }) {
        super()
        this.endpoint = endpoint
        this.interval = interval
        this.path = path
    }

    async start() {
        this.started = true

        this.pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(this.endpoint)

                // console.log(response.data, response.data[this.path])

                if (response.data[this.path] > this.lastBlock) {
                    this.lastBlock = response.data[this.path]
                    this.emit("block", response.data[this.path])
                }
            } catch (err) {
                console.error("Error fetching head:", err)
                this.emit("error", err)
            }
        }, this.interval)
    }

    stop = () => {
        clearInterval(this.pollInterval)
    }
}

module.exports = Poll