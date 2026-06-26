// test.js

const { MongoClient } = require("mongodb");

const uri =
"mongodb://sakwikicrafts_db_user:Makkah123@ac-3m3wz5u-shard-00-00.jdz4pj8.mongodb.net:27017,ac-3m3wz5u-shard-00-01.jdz4pj8.mongodb.net:27017,ac-3m3wz5u-shard-00-02.jdz4pj8.mongodb.net:27017/?ssl=true&replicaSet=atlas-3qz8ga-shard-0&authSource=admin&appName=goventure";

async function run() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    console.log("CONNECTED!");

    await client.close();
  } catch (err) {
    console.error(err);
  }
}

run();