const axios = require('axios')
const { cleanString } = require('../sanitize')

const algorand = {
    types: [
        'pay',
        'acfg',
        'axfer',
        'afrz',
        'appl',
        'stpf',
    ],
    denomination: 1e6,
}

algorand.getCurrency = async (id) => {
    const db = require('../mongodb').getDb()
    const assets = db.collection('assets')

    try {
        const mongoAsset = await assets.findOne({ asset_id: id, network: 'algorand' })

        if (mongoAsset) {
            return mongoAsset
        }

        const response = await axios.get(`https://mainnet-idx.algonode.network/v2/assets/${id}`)

        // b64 to utf then clean out any unwanted characters, allow only letters, numbers, and spaces and hyphens

        const asset = {
            network: 'algorand',
            asset_id: response.data.asset.index,
            name: response.data.asset.params["unit-name"] || cleanString(Buffer.from(response.data.asset.params["unit-name-b64" || "name-b64"])) || "Unknown Currency (Error code c3)",
            decimals: response.data.asset.params.decimals,
        }

        await assets.insertOne(asset)

        return asset || "Unknown Currency (Error code c1)"
    } catch (err) {
        console.error(err, id)
        return "Unknown Currency (Error code c2)"
    }
}

algorand.cleanTx = async (tx) => {
    const clean = {
        type: tx["tx-type"],

        sender: tx.sender,
        
        blockHeight: tx["confirmed-round"],
        txId: tx.id,
        fee: tx.fee / algorand.denomination,
    }

    switch(tx["tx-type"]) {
        case 'pay':
            clean.receiver = tx["payment-transaction"].receiver

            clean.currency = 'ALGO'
            clean.amount = tx["payment-transaction"].amount / algorand.denomination
            
            break
        case 'acfg':
            clean.currency = algorand.getCurrency(tx["created-asset-index"] || tx["asset-config-transaction"]["asset-id"]).name

            break
        case 'axfer':
            const currency = await algorand.getCurrency(tx["asset-transfer-transaction"]["asset-id"])

            clean.receiver = tx["asset-transfer-transaction"].receiver
            
            clean.currency = currency.name
            clean.amount = tx["asset-transfer-transaction"].amount / (10 ** currency.decimals)

            break
        case 'afrz':
            clean.currency = await algorand.getCurrency(tx["asset-freeze-transaction"]["asset-id"]).name
        
            break
        case 'appl':
            clean.receiver = tx["application-transaction"]["application-id"]
            
            break
    }   

    return clean
}

module.exports = algorand