const express = require('express')
const cors = require('cors')
const app = express()
const port = 8000
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId ; 

// express middleware
app.use(cors())
// for parsing (json to js object)
app.use(express.json());


// user: dbuser1
// pass: 3mJ8WtRnDUUIDx0N


// mongodb connection uri
const uri = "mongodb+srv://dbuser1:3mJ8WtRnDUUIDx0N@cluster0.s3dal.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongodb instance or client creation
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");

        // GET API

        app.get('/users' , async(req,res) =>{

            const cursor = usersCollection.find({})
            const users = await cursor.toArray();
            res.send(users);
        })


        // POST API

       app.post('/users' , async(req,res)=>{
           const newUser = req.body 
           const result = await usersCollection.insertOne(newUser)
           console.log('got new user' , newUser)
           console.log('a new user has been inserted' , result)
           res.json(result)
       }) 

       // DELETE API

       app.delete( '/users/:id' , async(req,res) =>{

            const id = req.params.id
            console.log('deleting user with id' , id)
            const query = {_id:ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            console.log('deleting user ' , result)
            res.json(result)

       })

    


    } 
    
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// to check the node server is ok 
// if you write in address bar of a browser below link and found  the send result
// http://localhost:8000

app.get('/', (req, res) => {
    res.send('this is CRUD server')
})

// to check the node server is ok
// if you type below command in cmd of that project and get result of console.log
// (nodemon index.js) or (npm run start-dev)

app.listen(port, () => {
    console.log('listening to port', port)
})