const Blockchain = require('./blockchain');
const Block = require('./block');
const crypto = require('./crypto');

describe('Blockchain', () => {
    let  blockchain, newChain, originalChain;
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain;
    });

    it('contains a the chain instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('the genesis block should be the first one', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'myCustomData';
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        beforeEach(() => {
            blockchain.addBlock({ data: 'Hello' });
            blockchain.addBlock({ data: 'World' });
            blockchain.addBlock({ data: 'From Blockchain' });
        });

        it('should return false is the first block is not the genesis block', () => {
            blockchain.chain[0] = { data: 'fake-genesis' };
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });

        it('should return false if the lastHash is invalid', () => {           
            blockchain.chain[2].previousHash = 'fake-hash';
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
        it('should return false if the data is tampered', () => {
            blockchain.chain[2].data = 'fake and tampered data';
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
        it('should return true if the chain is valid', () => {
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });

        it('should return false if the chain contains a block with a tampered difficulty', () => {
            const lastBlock = blockchain.chain[blockchain.chain.length-1];
            const previousHash = lastBlock.hash;
            const timestamp = Date.now();
            const nonce = 0;
            const data = 'INVALID-DATA';
            const difficulty = lastBlock.difficulty - 3;
            const hash = crypto.sha256(timestamp, previousHash, difficulty, nonce, data);
            const corruptBlock = new Block({
                timestamp, previousHash, hash, nonce, difficulty, data
            });
            blockchain.chain.push(corruptBlock);
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
    });

    describe('replaceChain()', () => {
        it('should not replace the chain if the new chain is not longer than the current one', () => {
            newChain.chain[0] = { new: 'chain'};
            blockchain.replaceChain(newChain.chain);
            expect(blockchain.chain).toEqual(originalChain.chain);

        });
        describe('the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'Hello' });
                newChain.addBlock({ data: 'World' });
                newChain.addBlock({ data: 'From Blockchain' });
            });
            it('should not replace the chain if the new chain is longer but invalid', () => {
                newChain.chain[1].hash = 'tampered-hash';
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain.chain);
            });
            it('should replace the chain if the new chain is longer', () => {
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(newChain.chain);
            });
        });
    });
});