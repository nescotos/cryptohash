import { GENESIS_DATA, MINE_RATE } from '../config';
const {sha256} = require('../utils');
const hexToBinary = require('hex-to-binary');

class Block {
    constructor({timestamp, previousHash, hash, data, nonce, difficulty}) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis(){
        return new this(GENESIS_DATA);
    }

    static adjustDifficulty({ originalBlock, timestamp }){
        const { difficulty } = originalBlock;
        if(difficulty < 1) return 1;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }

    static mineBlock({lastBlock, data}){
        let timestamp, hash;
        const previousHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = this.adjustDifficulty({ originalBlock: lastBlock, timestamp});
            hash = sha256(timestamp, previousHash, data, nonce, difficulty)
        }while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))
        return new this(
            {
                timestamp,
                previousHash,
                data,
                difficulty,
                nonce,
                hash: sha256(timestamp, previousHash, data, nonce, difficulty)
            }
        )
    }
}

module.exports = Block;