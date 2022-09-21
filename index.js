const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;


// use middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j5uzxrn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('wareHouse').collection('inventory');
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        })

        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        })

        // UPDATE
        // app.put('/inventory/id', async(req, res) => {
        //     const id = req.params.id;
        //     const updatedQantity = req.body;
        //     const filter = {_id: ObjectId(id)};
        //     const option = {upsert: true};
        //     const updatedDoc = {
        //         $set: {
        //             quantity: updatedQantity.quantity
        //         }
        //     }
        //     const result = await inventoryCollection.updateOne(filter, updatedDoc, option);
        //     res.send(result)
        // })

        // POST
        app.post('/inventory', async(req, res) => {
            const newInventory = req.body;
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        })

        // DELETE
        app.delete('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        });
       
    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running my node CRUD server')
});

app.listen(port, () => {
    console.log('CRUD server is running', port)
})