const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const deleteGreetings = async (req, res) => {
    const _id = req.params._id;
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db('exercise');
console.log(_id)
    await db.collection('greetings').deleteOne({_id: _id},function(err, result){
        console.log('deleted count',result.deletedCount)
        result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: "Not Found" });
            client.close();
    })
   
}

module.exports = {
    deleteGreetings
}