const { MongoClient } = require('mongodb');
import dotenv from 'dotenv';

dotenv.config();

let client;
let clientPromise;

const uri =process.env.MONGODB_URI;

if (!client) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

async function connectToDatabase() {
  if (!client.isConnected) {
    await clientPromise;
  }
  return client;
}

module.exports = { connectToDatabase };
