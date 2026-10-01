const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
    const uri = process.env.MONGO_URI;

    client = new MongoClient(uri);

    await client.connect();

    db = client.db("Luminary")

    console.log("Connected to MongoDB successfully")
}

function getDB() {
    return db;
}

export { connectDB, getDB };