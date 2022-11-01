const express = require('express')
const router = express.Router()

const arco = require("../helpers/mongodb")
let arcoDb;

router.use(express.json())

router.use((req, res, next) => {
    arcoDb = arco.getDb()
    next()
})

router.route('/')
    .get(async (req, res) => {
        if (!req.query.webhook) return res.status(400).send("Invalid Webhook href")

        try {
            const subscriptions = await arcoDb.collection("subscriptions").find({
                "webhook": req.query.webhook
            }).toArray()
    
            return res.status(200).json(subscriptions)    
        } catch (err) {
            return res.status(500).send("Error querying database")
        }
    })
    .post((req, res) => {
        // console.log(req.body.trigger)
        if (!req.body.trigger.network) return res.status(400).send("Missing Trigger Network")
        if (!req.body.trigger.condition_type) return res.status(400).send("Missing Condition Type")
        if (!req.body.trigger.condition_target) return res.status(400).send("Missing Condition Target")
        if (!req.body.trigger.condition) return res.status(400).send("Missing Condition")
        if (!req.body.webhook) return res.status(400).send("Missing Webhook")

        arcoDb.collection("subscriptions").insertOne({
            "trigger": {
                "network": req.body.trigger.network,
                "condition_type": req.body.trigger.condition_type,
                "condition_target": req.body.trigger.condition_target,
                "condition": req.body.trigger.condition
            },
            "webhook": req.body.webhook
        }, (err, result) => {
            if (err) return res.status(500).send("Error inserting subscription into database")
            return res.status(200).json(result.insertedId)
        })
    })
    .put((req, res) => {
        res.status(200).send('PUT request to subscriptions')
    })
    .delete((req, res) => {
        res.status(200).send('DELETE request to subscriptions')
    })

module.exports = router