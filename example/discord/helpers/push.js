const { createEmbed, createMessage, createButtons } = require("./discord")
const { shortenString } = require('./string')

const push = async (user, body) => {
    // return console.log(body)

    try {
        const { tx, trigger } = body

        // console.log(tx, trigger, body)

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

        let title = `Transaction Confirmed`

        switch(tx.type) {
            case ("pay" || "axfer"):
                title = `${incoming ? "Incoming" : "Outgoing"} Transfer Confirmed`

                break
            case "appl":
                title = `Application Call Confirmed`
            
                break
            case ("afrz" || "acfg"):
                title = `Asset Transaction Confirmed`

                break
        }
    
        const buttons = createButtons({
          link: `https://algoexplorer.io/tx/${tx.txId}`,
        })
    
        const embed = createEmbed({
          title: title,
          description: description,
          color: (tx.type === ("pay" || "axfer")) ? (incoming ? "#42be65" : "#fa4d56") : "#4589ff",
          txId: tx.txId.toString(),
          fees: tx.fee.toString()
        })

        createMessage({
            id: user.d_id,
            content: {
              embeds: [embed],
              components: [buttons]
            }
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { push: push }