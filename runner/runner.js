const { connect, getDb } = require("./helpers/mongodb")
const { ObjectId } = require("mongodb")
const jsonLogic = require("json-logic-js")
const Poll = require("./helpers/poller.js")
const { getBlock } = require("./helpers/blocks")
const { algorand } = require("./helpers/networks")
const { init, createEmbed, createMessage, createButtons } = require("./dispatch/discord")
const { shortenString } = require("./helpers/sanitize")

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

// init(() => {
//   const buttons = createButtons({
//     link: "https://algoexplorer.io/tx/VQJJ3FLE4PVBGXTLJVPMVBEBQNJR44S336IFYFLU26W7GRF7ZXVQ",
//   })

//   const embed = createEmbed({
//     title: "Transaction Confirmed",
//     description: "A transaction has been confirmed on the Algorand blockchain.",
//     color: "#42be65",
//     txId: "1234567890",
//     fees: "0.0001"
//   })


//   // console.log(embed)
//   createMessage({
//     id: "1029865783666430053",
//     content: {
//       embeds: [embed],
//       components: [buttons]
//     }
//   })
  poller.start()
// })

init(() => {
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
                "paused": false
              }
            )
  
            if (!triggers) return
  
            triggers.forEach(async (trigger) => {  
              const condition = jsonLogic.apply(trigger.trigger.condition, tx)
  
              if (!condition) return
  
              // console.log("aosdsjaoidj", trigger._id.toString())

              const triggerSubscribers = subscriptions.aggregate(
                [
                  {
                    '$match': {
                      '_id': trigger._id
                    }
                  }, {
                    '$lookup': {
                      'from': 'discord', 
                      'localField': '_id', 
                      'foreignField': 'subscriptions', 
                      'as': 'subscribers'
                    }
                  }
                ]
              )

              const subscribers = await triggerSubscribers.toArray()

              subscribers[0].subscribers.forEach((subscriber) => {
                const incoming = trigger.trigger.condition_target == tx.receiver

                let description = `A transaction sent from [${shortenString(tx.sender, 8)}](https://algoexplorer.io/address/${tx.sender}) to [${shortenString(tx.receiver, 8)}](https://algoexplorer.io/address/${tx.sender}) has been confirmed on the Algorand blockchain.`

                switch(tx.type) {
                  case "pay":
                    description = `A transaction sent from [${shortenString(tx.sender, 8)}](https://algoexplorer.io/address/${tx.sender}) to [${shortenString(tx.receiver, 8)}](https://algoexplorer.io/address/${tx.receiver}) of ${tx.amount} ${tx.currency} has been confirmed on the Algorand blockchain.`
                    break;
                  case "keyreg":
                    description = `A key registration transaction has been confirmed on the Algorand blockchain.`
                    
                    break
                  case "acfg":
                    description = `An asset configuration (${tx.currency}) transaction has been confirmed on the Algorand blockchain.`
                    
                    break
                  case "axfer":
                    description = `A transfer of ${tx.amount} ${tx.currency} transaction has been confirmed on the Algorand blockchain.`

                    break
                  case "afrz":
                    description = `An asset freeze of ${tx.amount} ${tx.currency} transaction has been confirmed on the Algorand blockchain.`

                    break
                  case "appl":
                    description = `An application call from [${shortenString(tx.sender, 8)}](https://algoexplorer.io/address/${tx.sender}) to application [${shortenString(tx.receiver, 8)}](https://algoexplorer.io/application/${tx.receiver}) has been confirmed on the Algorand blockchain.`

                    break
                }

                const buttons = createButtons({
                  link: `https://algoexplorer.io/tx/${tx.txId}`,
                })
  
                const embed = createEmbed({
                  title: `${(tx.type === ("pay" || "axfer")) && (incoming ? "Incoming " : "Outgoing ")}Transaction Confirmed`,
                  description: description,
                  color: (tx.type === ("pay" || "axfer")) ? (incoming ? "#42be65" : "#fa4d56") : "#4589ff",
                  txId: tx.txId.toString(),
                  fees: tx.fee.toString()
                })
  
                createMessage({
                  id: subscriber.d_id,
                  content: {
                    embeds: [embed],
                    components: [buttons]
                  }
                })  
              })
            })
            i++
          }

          console.log("Algorand Block", block + ":", transactions.length)
          console.log()
        }
      })  
    })
  })  
})
// TODO: REMOVE TESTS & COMPLETE POLLER

