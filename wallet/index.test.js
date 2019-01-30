const Wallet = require('./index');
const { verifySignature } = require('../utils');

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('it should have a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('it should have a `publicKey`', () => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('Signing Data', () => {
        const data = 'foo-bar-test-blockchain';
        it('should verify a correct signature', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                signature: wallet.sign(data),
                data
            })).toBe(true);
        });
        it('should not verify an incorrect signature', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                signature: new Wallet().sign(data),
                data
            })).toBe(false);
        });
    });
    
});

