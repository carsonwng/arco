const express = require('express')
const app = express()
const port = 3001

const subscriptionsRouter = require('./routes/subscriptions')
app.use("/subscriptions", subscriptionsRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Running on port 3001')
})