const express = require('express');
const Blockchain = require('./blockchain');
const config = require('./config');
const bodyParser = require('body-parser');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

app.use(bodyParser.urlencoded({}));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    console.log(`Transaction Requested`);
    blockchain.addBlock({data: req.body.data});
    res.send('- Transaction being mined!');
});

app.listen(config.PORT, () => {
    console.log(`- Node Runing at ${config.PORT}`);
});