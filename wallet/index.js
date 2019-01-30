const { STARTING_BALANCE } = require('../config');
const { ec } = require('../utils');
const { sha256 } = require('../utils/crypto');

class Wallet {
    constructor(){
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data){
        return this.keyPair.sign(sha256(data));
    }
}

module.exports = Wallet;