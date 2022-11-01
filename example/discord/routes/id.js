const express = require('express')
const router = express.Router()

const arco = require("../helpers/mongodb")

const discord = require('../helpers/discord')

let arcoDb;

router.use(express.json())

router.use((req, res, next) => {
    discordClient = discord.getClient()
    arcoDb = arco.getDb()
    next()
})

router.route('/')
    .post(async (req, res) => {
        // console.log(req.body)
        if (!discordClient) return res.status(500).send("Discord Client not initialized")
        if (!req.body.id) return res.status(400).send("Missing Discord User ID")

        let guild = discordClient.guilds.cache.get('1034650342966689872')

        // const user = await guild.members.cache.has("484866150874742797")
        try {
            await guild.members.fetch(req.body.id)
        } catch (err) {
            if (err.rawError.message === "Unknown Member") {
                return res.status(200).send("Discord User not found in arco server")
            }

            return res.status(500).send("Error querying discord")
        }

        const existing = await arcoDb.findOne({
            "d_id": req.body.id
        }).catch(err => {
            return res.status(500).send("Error querying database")
        })

        if (existing) return res.status(200).json({ webhook_id: existing._id })

        arcoDb.insertOne({
            "d_id": req.body.id
        }, (err, result) => {
            if (err) return res.status(500).send("Error inserting discord user into database")
            return res.status(200).json({ webhook_id: result.insertedId })
        })
    })

module.exports = router