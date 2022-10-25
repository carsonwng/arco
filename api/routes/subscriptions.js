const express = require('express')
const router = express.Router()

// Path: api\routes\subscriptions.js

const arco = require("../helpers/mongodb")
let arcoDb;

router.use((req, res, next) => {
    arcoDb = arco.getDb()
    next()
})

router.route('/')
    .get((req, res) => {
        res.sendStatus(405)
    })
    .post((req, res) => {
        // res.status(200).send('POST request to subscriptions')

        const sample = {
            version: 1,
            type: 1,
            trigger: {
                network: "algo",
                condition_type: "address", // block, tx, price, address, contract
                condition_target: "0xaddr",
                condition: {}
            },
            cb: "https://api.example.com",
        }

        arcoDb.insertOne(sample, (err, result) => {
            if (err) {
                return res.status(500).send("Error inserting into database")
            }

            res.status(200).send()
        })
    })
    .put((req, res) => {
        res.status(200).send('PUT request to subscriptions')
    })
    .delete((req, res) => {
        res.status(200).send('DELETE request to subscriptions')
    })

module.exports = router