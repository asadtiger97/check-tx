const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const fs = require("fs");
// Database Name
const dbName = 'presale';

// Collection Name
const collectionName = 'allBuyPhase1';

// Create a new MongoClient
const client = new MongoClient(uri);

// docker container restart 178fae1ce48fbaed9b068056783ce57da5b095a18608e50a31f391d1d3e4476d
// docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
// docker pull mongodb/mongodb-community-server:latest


async function main() {
  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const pipeline = [
      {
        $group: {
          _id: "$From",
          count: { $sum: 1 }
        }
      }


    ];

    const result = await collection.aggregate(pipeline).toArray();

    console.log(result)
    console.log(`${result.length} documents processed.`);
    for (let i of result) {

      fs.appendFile("./phase1_investors.csv", `${i._id}\n`, (err) => {
        if (err) throw err;
      })


    }
  } finally {
    // Close the connection
    await client.close();
  }
}

main().catch(console.error);
