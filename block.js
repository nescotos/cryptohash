import { GENESIS_DATA } from './config';
const crypto = require('./crypto');

class Block {
    constructor({timestamp, previousHash, hash, data}) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis(){
        return new this(GENESIS_DATA);
    }

    static mineBlock({lastBlock, data}){
        const timestamp = Date.now();
        const previousHash = lastBlock.hash;
        return new this(
            {
                timestamp,
                previousHash,
                data,
                hash: crypto.sha256(timestamp, previousHash, data)
            }
        )
    }
}

module.exports = Block;