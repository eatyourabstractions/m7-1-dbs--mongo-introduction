const fs = require('file-system');

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () =>{
   
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db('exercise');
        const result = await db.collection("greetings").insertMany(greetings);
        console.log('result', result);
    } catch (err) {
        console.log(err.stack);
    }
    client.close();
}

batchImport();

module.exports = {
    batchImport
}