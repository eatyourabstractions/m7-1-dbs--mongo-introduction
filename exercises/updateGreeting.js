const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const updateGreeting = async (req, res) => {
    const id = req.params._id
    const hasIt = req.body.hasOwnProperty('hello')
    let msg
    if(hasIt){
        msg = req.body['hello']
       
    } else {
        res.status(404).json({ status: 404, _id, data: "Need a hello key" })
    }

    // res.status(200).json({ status: 200, id, data: {hello: msg} })

    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db('exercise');
        db.collection("greetings").updateOne({_id: id},{$set: {hello: msg}},function(err, result){
            if (err) throw err;
            assert.strictEqual(1, result.matchedCount);
            assert.strictEqual(1, result.modifiedCount);
           
            client.close();
            res.status(200).json({ status: 200, id, data: result })
           
        })
        
        
    } catch (err) {
        console.log(err.stack);
    }
    
}


module.exports = {
    updateGreeting
}