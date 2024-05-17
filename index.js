const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 9000

const app = express()


const corsOption = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption))

app.use(express.json())



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-esohqc9-shard-00-00.okia5sv.mongodb.net:27017,ac-esohqc9-shard-00-01.okia5sv.mongodb.net:27017,ac-esohqc9-shard-00-02.okia5sv.mongodb.net:27017/?ssl=true&replicaSet=atlas-mrsszx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // Server Collection

        const serviceCollection = client.db('Elysium').collection('Services')

        const bookCollection = client.db('Elysium').collection('Bookings')

        // all data from db

        app.get('/services', async (req, res) => {

            const result = await serviceCollection.find().toArray()

            res.send(result)
        })

        // get single data

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })

        // post service Data

        app.post('/services', async (req, res) => {
            const addService = req.body
            console.log(addService)
            const result = await serviceCollection.insertOne(addService)
            res.send(result)
        })

        // get service data by email

        app.get('/user-service/:email', async (req, res) => {
            const email = req.params.email
            const query = { providerEmail: email }
            const result = await serviceCollection.find(query).toArray()
            res.send(result)
        })

        // delete service from db

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })

        // update Service from db

        app.put('/service/:id', async (req, res) => {
            const id = req.params.id
            const updateData = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    ...updateData
                }
            }
            const result = await serviceCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // post booking data
        app.post('/booking', async (req, res) => {
            const bookData = req.body
            console.log(bookData)
            const result = await bookCollection.insertOne(bookData)
            res.send(result)
        })
        // get booking data
        app.get('/booking', async (req, res) => {
            const result = await bookCollection.find().toArray()
            res.send(result)
        })

        // get data for booked service
        app.get('/booked-services/:email', async (req, res) => {
            const email = req.params.email
            const query = { userEmail: email }
            const result = await bookCollection.find(query).toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from the other Side')
})

app.listen(port, () => console.log(`Server running on port ${port}`))