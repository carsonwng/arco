require("dotenv").config()
const { getDb, connect } = require("./helpers/mongodb")
const subscriptionsRouter = require('./routes/subscriptions')

const express = require('express')
const app = express()
const port = 3001

connect(() => {
    app.use("/subscriptions", subscriptionsRouter)

    app.get('*', (req, res) => {
        res.sendStatus(404)
    })
    
    app.listen(port)
})

