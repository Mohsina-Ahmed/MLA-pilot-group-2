const { MongoClient } = require("mongodb")
const uri = "mongodb://root:cfgmla23@mongodb:27017"

const client = new MongoClient(uri);
async function connect() {
    await client.connect();
    return client.db('test-database')
}