const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getCollection = async () => {

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    console.log("connected!");

    const db = client.db('exercise_1');

    const users = await db.collection("users").find().toArray();

    console.log('users', users);

    client.close();
    console.log("disconnected!");
    

} 

 getCollection();
