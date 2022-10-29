require("dotenv").config()

const { init } = require('./helpers/discord')
const { getDb, connect } = require("./helpers/mongodb")
const webhookRouter = require('./routes/webhooks')

const express = require('express')
const app = express()
const port = 3002

init(() => {
    connect(() => {
        app.use("/webhooks", webhookRouter)
    
        app.get('*', (req, res) => {
            res.sendStatus(404)
        })
        
        app.listen(port)
    })    
})

