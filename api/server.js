require("dotenv").config()
const { connect } = require("./helpers/mongodb")
const subscriptionsRouter = require('./routes/subscriptions')

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

connect(() => {
    app.use(cors())

    app.use("/subscriptions", subscriptionsRouter)

    app.get('*', (req, res) => {
        res.sendStatus(404)
    })
    
    app.listen(port)
})

