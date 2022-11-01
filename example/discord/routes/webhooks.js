const express = require('express')
const router = express.Router()

const arco = require("../helpers/mongodb")
const { ObjectId } = require('mongodb')

const { push } = require("../helpers/push")

router.use(express.json())

router.use((req, res, next) => {
    next()
})

// router.use('/:id', (req, res, next) => {
//     console.log(req.params.id)
//     next()
// }))

router.route('/:id')
    .post(async (req, res) => {
        // console.log(req.body)

        if (!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid Subscription ID")

        const user = await arcoDb.findOne({
            '_id': new ObjectId(req.params.id)
        })

        if (!user) return res.status(404).send("Discord Subscription not found")

        push(user, req.body)
        // console.log(reqbo)
        // res.json(req.body)
        res.sendStatus(200)
    })

module.exports = router