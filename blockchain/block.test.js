const Block = require('./block');
const config = require('../config');
const crypto = require('../utils');
const hexToBinary = require('hex-to-binary');

describe('Block', () => {
    const timestamp = 1544627272;
    const previousHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = 'somedata';
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({
        timestamp, 
        previousHash,
        hash,
        data,
        nonce,
        difficulty
    });

    it('block should be created succesfully', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.hash).toEqual(hash);
        expect(block.previousHash).toEqual(previousHash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the data from genesis block', () => {
            expect(genesisBlock).toEqual(config.GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'my_data';
        const minedBlock = Block.mineBlock({ lastBlock, data});

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the previousHash to be the hash of the last block', () => {
            expect(minedBlock.previousHash).toEqual(lastBlock.hash);
        });

        it('sets the data', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a timestamp', () => {
            expect(minedBlock.timestamp).toBeDefined();
        });

        it('creates a SHA-256 hash based on the inputs', () => {
            expect(minedBlock.hash).toEqual(crypto.sha256(minedBlock.timestamp, minedBlock.nonce, minedBlock.difficulty, minedBlock.previousHash, minedBlock.data));
        });

        it('the hash should match the diffulty',  () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('should adjust the difficulty', () => {
            const options = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];
            expect(options.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it('the difficulty should raise if the block was mined too quickly', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + config.MINE_RATE - 100})).toEqual(block.difficulty + 1);
        });
        it('the difficulty should decrease if the block was mined too slow', () => {
            expect(Block.adjustDifficulty({ originalBlock: block, timestamp: block.timestamp + config.MINE_RATE + 100 })).toEqual(block.difficulty - 1);
        });
        it('the lower limit should be 1', () => {
            block.difficulty = -1;
            expect(Block.adjustDifficulty({ originalBlock: block})).toEqual(1);
        });
    });
});