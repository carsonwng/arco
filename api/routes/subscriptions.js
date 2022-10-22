const express = require('express')
const router = express.Router()

// Path: api\routes\subscriptions.js

router.route('/')
    .post((req, res) => {
        res.status(200).send('POST request to subscriptions')
    })
    .put((req, res) => {
        res.status(200).send('PUT request to subscriptions')
    })
    .delete((req, res) => {
        res.status(200).send('DELETE request to subscriptions')
    })

module.exports = router