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
        // this is a request from Users.js  to show the all users 

        app.get('/users' , async(req,res) =>{

            const cursor = usersCollection.find({})
            const users = await cursor.toArray();
            res.send(users);
        })

         // GET API ( Finding the specific user by id for updating )
         // it is a request from UpdateUser.js to find the specific user by id

         app.get('/users/:id', async(req,res)=>{

            const id = req.params.id  
            console.log(' load user with id' , id)
            const query = {_id:ObjectId(id)}
            const result = await usersCollection.findOne(query)
            console.log('searched user info ' , result)
            res.send(result)
        })

        // PUT or PATCH or UPDATE API
        // this is a request from UpdateUser.js to update

        app.put('/users/:id' , async(req,res)=>{
            const id = req.params.id
            console.log('updating the user' , id)
            const updatedUser = req.body
            const filter = {_id:ObjectId(id)}
            const options = {upsert:true}
            const updateDoc = {
                $set: {
                    name: updatedUser.name ,
                    email: updatedUser.email
                }
            }
            const result = await usersCollection.updateOne(filter , updateDoc , options)
            
            res.json(result)
        })




        // POST API
        // this is a request from AddUser.js to add a new user 
       app.post('/users' , async(req,res)=>{
           const newUser = req.body 
           const result = await usersCollection.insertOne(newUser)
           console.log('got new user' , newUser)
           console.log('a new user has been inserted' , result)
           res.json(result)
       }) 

       // DELETE API
       // this is a request from Users.js to delete a specific user by id

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