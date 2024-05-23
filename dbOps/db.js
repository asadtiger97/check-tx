const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'presale';

// Collection Name
const collectionName = 'allBuyPhase1';

// Create a new MongoClient
const client = new MongoClient(uri);

// let startBlock = 17063375; -- phase 1 start 
// let endBlock = 17246710; -- phase 1 end



async function main() {
  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const pipeline = [
      {
        $group: {
          _id: '$Transaction Hash',
          doc: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$doc' }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    console.log(`${result.length} documents processed.`);
    // const deleteResult = await collection.deleteMany({ "Status": "Error in Txn" });

    // console.log(`${deleteResult.deletedCount} documents deleted.`);

    // Uncomment the below lines to delete duplicates
    // await collection.deleteMany({ '_id': { $nin: result.map(doc => doc._id) } });
    // console.log('Duplicates removed successfully.');

  } finally {
    // Close the connection
    await client.close();
  }
}

main().catch(console.error);
