const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from BBOOK Server.');
})

app.listen(port, () => {
    console.log(`BBOOK Server is running on ${port}`);
})