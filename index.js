const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// express middleware
app.use(cors());
app.use(bodyParser.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_UPass}@cluster0.rhdf1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bookCollection = client.db('bBook').collection('book');

        // load all data
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })

        // load data by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await bookCollection.findOne(query);
            res.send(book);
        })

        // update quantity
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const setUpdatedInfo = {
                $set: {
                    quantity: updatedInfo.updatedQuantity,
                    sold: updatedInfo.updatedSold
                }
            };
            const result = await bookCollection.updateOne(filter, setUpdatedInfo, options);
            res.send(result);
        })

        // delete a item
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from BBOOK Server.');
})

app.listen(port, () => {
    console.log(`BBOOK Server is running on ${port}`);
})