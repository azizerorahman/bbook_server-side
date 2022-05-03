const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// express middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from BBOOK Server.');
})

app.listen(port, () => {
    console.log(`BBOOK Server is running on ${port}`);
})