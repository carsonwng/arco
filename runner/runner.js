const { connect, getDb } = require("./helpers/mongodb")
const jsonLogic = require("json-logic-js")
const Poll = require("./helpers/poller.js")
const { getBlock } = require("./helpers/blocks")
const { algorand } = require("./helpers/networks")

// const start = console.time()
// connect(() => {
//     const db = getDb()
//     db.find({ type: 1 })

//     let i = 0;
//     while (i <= 1e6) {
//         value = jsonLogic.apply({
//             "or": [
//               {
//                 "==": [
//                   {
//                     "var": "sender"
//                   },
//                   "YNH3E6RUOK7HAXBB4ZYBVASZEP2B7ZUN7XBMYHSFB2ZHWFYOE4OYJTZSTQ"
//                 ]
//               },
//               {
//                 "==": [
//                   {
//                     "var": "receiver"
//                   },
//                   "YNH3E6RUOK7HAXBB4ZYBVASZEP2B7ZUN7XBMYHSFB2ZHWFYOE4OYJTZSTQ"
//                 ]
//               }
//             ]
//         }, {
//             sender: "YNH3E6RUOK7HAXBB4ZYBVASZEP2B7ZUN7XBMYHSFB2ZHWFYOE4OYJTZSTQ",
//             receiver: "YNH3E6RUOK7HAXBB4ZYBVASZEP2B7ZUN7XBMYHSFB2ZHWFYOE4OYJTZSTQ"
//         })
        
//         i++
//     }

//     console.timeEnd(start)
// })

const poller = new Poll({
    endpoint: "https://mainnet-idx.algonode.cloud/health",
    interval: 1000,
    path: "round"
})

poller.start()

connect(() => {
  const db = getDb()
  const subscriptions = db.collection("subscriptions")

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
              }
            }
          )

          if (!triggers) return

          triggers.forEach((trigger) => {
            const condition = jsonLogic.apply(trigger.trigger.condition, tx)

            if (condition) {
              console.log("Triggered!", tx.txId)
            }
          })
          i++
        }
        console.log()
        // console.log("success!", transactions)
        console.log("Algorand Block", block + ":", transactions.length)
      }
    })  
  })  
})

// TODO: REMOVE TESTS & COMPLETE POLLER