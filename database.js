const { MongoClient } = require("mongodb")
require('dotenv').config()

const client = new MongoClient(process.env.MONGODB_URI)

const dbName = "NodeTesting"

async function main() {
    await client.connect();
    console.log("Connected Successfully to server")
    const db = client.db(dbName)
    const collection = db.collection("User");

    const findResult = await collection.find({city:"Rampur"}).toArray();
    console.log(findResult);
    return 'done'
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close())
