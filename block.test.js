const Block = require('./block');
const config = require('./config');
const crypto = require('./crypto');

describe('Block', () => {
    const timestamp = 'date';
    const previousHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = 'somedata';
    const block = new Block({
        timestamp, 
        previousHash,
        hash,
        data
    });

    it('block should be created succesfully', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.hash).toEqual(hash);
        expect(block.previousHash).toEqual(previousHash);
        expect(block.data).toEqual(data);
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
            expect(minedBlock.hash).toEqual(crypto.sha256(minedBlock.timestamp, minedBlock.previousHash, minedBlock.data));
        });
    });
});