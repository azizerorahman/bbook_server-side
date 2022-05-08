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
        const database = client.db('bBook');
        const bookCollection = database.collection('book');
        const userReviewCollection = database.collection('userReview');

        // load all book data
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = bookCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })

        // load book data by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await bookCollection.findOne(query);
            res.send(book);
        })

        // add new book
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book);
            res.send(result);
        })

        // update quantity of book
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

        // delete a book
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })

        // load all user review data
        app.get('/user-reviews', async (req, res) => {
            const query = {};
            const cursor = userReviewCollection.find(query);
            const userReviews = await cursor.toArray();
            res.send(userReviews);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from BBOOK Server.');
})

app.listen(port, () => {
    console.log(`BBOOK Server is running on ${port}`);
})