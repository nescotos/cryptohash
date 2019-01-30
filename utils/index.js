const EC = require('elliptic').ec;
const { sha256 } = require('./crypto');

const ec = new EC('secp256k1');

const verifySignature = ({signature, publicKey, data}) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(sha256(data), signature); 
};

module.exports = { ec, verifySignature };