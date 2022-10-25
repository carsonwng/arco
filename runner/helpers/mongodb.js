require("dotenv").config()
const { MongoClient } = require('mongodb')

const uri = process.env.MONGO_URI

let arcoDb;

module.exports = {
    connect: (cb) => {
        try {
            client = new MongoClient(uri)

            arcoDb = client.db("arco")
    
            return cb()    
        } catch (err) {
            console.error(err)
            process.exit()
        }
    },
    getDb: () => {
        return arcoDb
    }
}