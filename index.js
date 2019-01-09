const express = require('express');
const Blockchain = require('./blockchain');
const config = require('./config');
const bodyParser = require('body-parser');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

setTimeout(() => {
    pubsub.broadcastChain();
}, 1000);

app.use(bodyParser.urlencoded({}));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    console.log(`Transaction Requested`);
    blockchain.addBlock({data: req.body.data});
    res.send('- Transaction being mined!');
});

const DEFAULT_PORT = config.PORT;
let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`- Node Runing at ${PORT}`);
});