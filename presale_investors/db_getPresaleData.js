const { MongoClient } = require('mongodb');
const fs = require("fs");

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'presale';

// Collection Name
const collectionName = 'allBuy';

// Create a new MongoClient
const client = new MongoClient(uri);

// 1. docker pull mongodb/mongodb-community-server:latest
// 2. docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
// 3. docker container restart 178fae1ce48fbaed9b068056783ce57da5b095a18608e50a31f391d1d3e4476d


async function main() {
  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const pipeline = [
        {
          $group:
          
            {
              _id: "$Wallet",
              amount: {
                $sum: "$ Amount"
              }
            }
        }
      ]

    const result = await collection.aggregate(pipeline).toArray();

    console.log(`${result.length} documents processed.`);
    for (let i of result) {

      fs.appendFile("./all_investors.csv", `${i._id}, ${i.amount}\n`, (err) => {
        if (err) throw err;
      })


    }
  } finally {
    // Close the connection
    await client.close();
  }
}

main().catch(console.error);
