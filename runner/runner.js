require("dotenv").config()
const { connect, getDb } = require("./helpers/mongodb")
const jsonLogic = require("json-logic-js")
const Poll = require("./helpers/poller.js")
const { getBlock } = require("./helpers/blocks")
const { algorand } = require("./helpers/networks")

const axios = require("axios")

const poller = new Poll({
    endpoint: "https://mainnet-idx.algonode.cloud/health",
    interval: 1000,
    path: "round"
})

poller.start()

connect(() => {
  const db = getDb()
  const subscriptions = db.collection("subscriptions")
  const discordSubscriptions = db.collection("discord")

  poller.on("block", (block) => {
    console.log("Algorand", block)
  
    getBlock({
      endpoint: `https://mainnet-idx.algonode.network/v2/blocks/${block}`,
      path: "transactions",
      callback: async (transactions) => {
        if (!transactions) return

        // await algorand.cleanTx(transactions[0])
        let i = 0;
        while (i < transactions.length) {
          const tx = await algorand.cleanTx(transactions[i])
          let targets = [];

          targets.push(tx.sender)

          if (tx.receiver) {
            targets.push(tx.receiver)
          }

          const triggers = subscriptions.find(
            {
              "trigger.condition_target": {
                $in: targets
              },
              '$or': [
                {
                  'paused': false
                }, {
                  'paused': {
                    '$exists': false
                  }
                }
              ]
            }
          )

          if (!triggers) return

          triggers.forEach(async (trigger) => {  
            const condition = jsonLogic.apply(trigger.trigger.condition, tx)

            if (!condition) return

            console.log("sending webhook", trigger.webhook)

            await axios.post(trigger.webhook, {
              tx: tx,
              trigger: trigger
            }).catch((err) => {
              console.log(err)
            })
          })

          i++
        }

        // console.log("Algorand Block", block + ":", transactions.length)
        // console.log()
      }
    })  
  })
})  
// TODO: REMOVE TESTS & COMPLETE POLLER

