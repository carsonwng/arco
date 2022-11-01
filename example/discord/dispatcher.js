require("dotenv").config()

const { init } = require('./helpers/discord')
const { getDb, connect } = require("./helpers/mongodb")
const webhookRouter = require('./routes/webhooks')
const idRouter = require('./routes/id')

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3002

init(() => {
    connect(() => {
        app.use(cors())

        app.use("/id", idRouter)
        app.use("/webhooks", webhookRouter)
    
        app.get('*', (req, res) => {
            res.sendStatus(404)
        })
        
        app.listen(port)
    })    
})

