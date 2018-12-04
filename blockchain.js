const Block = require('./block');
const crypto = require('./crypto');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({ data }){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain){
        if(chain.length <= this.chain.length || !Blockchain.isValidChain(chain)){
            console.error('Invalid or shorter chain is coming. This wont be replaced by the current one');
            return;
        } 
        this.chain = chain;
    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }
        for(let i = 1; i < chain.length; i++){
            const currentPreviousHash = chain[i - 1].hash;
            const { timestamp, previousHash, hash, data } = chain[i];
            if(currentPreviousHash != previousHash) return false;
            if(crypto.sha256(timestamp, previousHash, data) !== hash) return false;
        }
        return true;
    }
}

module.exports = Blockchain;