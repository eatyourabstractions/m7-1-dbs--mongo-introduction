const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    console.log("connected!");

    const db = client.db('exercise_1');

    const users = await db.collection("users").find().toArray();

    if (users === undefined || users.length == 0) {
        res
            .status(404)
            .send('sorry buddy!')
    } else {
        res
            .status(200)
            .send({status: 200, data: users})
    }

    

    client.close();
    console.log("disconnected!");
    

} 

module.exports ={
    getUsers
   }