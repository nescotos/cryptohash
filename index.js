const express = require('express');
const Blockchain = require('./blockchain/blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const request = require('request');
const config = require('./config');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const Wallet = require('./wallet');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool});

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

app.post('/api/transact', (req,res) => {
    const {amount, recipient} = req.body;
    let transaction = transactionPool.existingTransaction({inputAddress: wallet.publicKey});
    try{
        if(transaction){
            transaction.update({senderWallet: wallet, recipient, amount});
        }else{
            transaction = wallet.createTransaction({recipient, amount});
        }

    }catch(error){
        return res.status(400).json({type: 'error', message: error.message});
    }
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    res.json({type: 'success', transaction});  
});

app.get('/api/transactionPool', (req, res) => {
    res.json(transactionPool.transactionMap);
});

const sync = () => {
    request({
        url: `${ROOT_NODE}/api/blocks`
    }, (err, response, body) => {
        if(!err && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('- Syncing chain to the root one', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({
        url: `${ROOT_NODE}/api/transactionPool`
    }, (err, response, body) => {
        if(!err && response.statusCode === 200){
            const rootTransactionPool = JSON.parse(body);
            console.log('- Replacing Transaction Pool Map on Start Process');
            transactionPool.setTransactionPool(rootTransactionPool);
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
        sync();
    }
});