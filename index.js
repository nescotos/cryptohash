const express = require('express');
const Blockchain = require('./blockchain/blockchain');
const request = require('request');
const config = require('./config');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

const ROOT_NODE = `http://localhost:${config.PORT}`;

setTimeout(() => {
    pubsub.broadcastChain();
}, 1000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    console.log(`- Transaction Requested`);
    blockchain.addBlock({data: req.body.data});
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

const syncChains = () => {
    request({
        url: `${ROOT_NODE}/api/blocks`
    }, (err, response, body) => {
        if(!err && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('- Syncing chain to the root one', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
}

const DEFAULT_PORT = config.PORT;
let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`- Node Runing at ${PORT}`);
    if(PORT !== DEFAULT_PORT){
        syncChains();
    }
});