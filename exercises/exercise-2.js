const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


const createGreeting = async (req, res) => {
    // temporary content... for testing purposes.
    try {
        // TODO: connect...
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();
        // TODO: declare 'db'
        const db = client.db('exercise');
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        await db.listCollections({name: 'greetings'})
            .next(async function(err, colInfo){
                if(colInfo){
                    console.log('it exists')
                    const result = await db.collection("greetings").insertOne(req.body);
                    
                   assert.strictEqual(1, result.insertedCount);
                    
                    if(result){
                        res.status(201).json({ status: 201, data: result });
                    } else {
                        res.status(500).json({ status: 500, data: req.body, message: err });
                   
                    }
                        
                } else{
                    await db.createCollection("greetings", function (err, res) {
                        if (err) throw err;
                        console.log("Collection created!");
                    });
                    const result = await db.collection("greetings").insertOne(req.body);
                    assert.strictEqual(1, result.insertedCount);
                    if(success){
                        res.status(201).json({ status: 201, data: result });
                    } else {
                        res.status(500).json({ status: 500, data: req.body, message: err });
                    }
                    
                    
                }
                client.close();
            })
      } catch (err) {
        console.log(err.stack);
      }

    // console.log(req.body);
    // res.status(200).json("ok");
  };

  const getGreeting = async (req, res) => {
    const _id = req.params._id;
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db('exercise');

    db.collection('greetings').findOne({_id},function(err, result){
        result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: "Not Found" });
            client.close();
    })

  };

  const getGreetings = async (req, res) =>{
    const start = Number( req.param('start'))
    const limit = Number( req.param('limit'))
    const upperLimit = start + limit;
    console.log('startlimit', start+limit)
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db('exercise');

    const sliceMyArr = (lhs, rhs, arr) =>{
        if(lhs < 0){
            return {status: 400, data: 'start limit must be higher that 0'}
        } else if(rhs > arr.length ){
            return {status: 400,
                     data: arr.slice(Math.max(arr.length - 10, 0)), 
                     message:`upper limit exceeded, voila the last 10 items`}
        } else {
           return  {status: 200, data: arr.slice(lhs, rhs)}
        }
    }

    db.collection('greetings').find({}).toArray(function(err, result){
        if (err) throw err;
        if (result.length == 0) {
            res.status(404).json({ status: 404, data: "Not Found" });
        }else if(!isNaN(upperLimit)){
            res.status(200).json({ status: 200, data: sliceMyArr(start, upperLimit, result) })
        } else if(result.length > 25) {
            const firstItems = result.slice(0, 25);
            res.status(200).json({ status: 200, data: firstItems })
        } else {
            res.status(200).json({ status: 200, data: result })
        }
        client.close();

    })

  }

  module.exports = {
      createGreeting,
      getGreeting,
      getGreetings
  }