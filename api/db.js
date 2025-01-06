const { MongoClient } = require('mongodb');


let client;
let clientPromise;

const uri ='mongodb+srv://gonzalezmartinnatanael:1Tbbr7KZOnP77SM7@cluster0.r5te7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
