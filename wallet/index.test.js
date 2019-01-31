const Wallet = require('./index');
const { verifySignature } = require('../utils');
const Transaction = require('./transaction');

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

    describe('createTransaction', () => {
        describe('the amount exceeds the current balance', () => {
            it('should throw an error', () => {
                expect(() => wallet.createTransaction({ amount: 985455, recipient: 'some-recipient' } )).toThrow('Amount exceeds balance');
            });
        });

        describe('the amount is valid', () => {
            let transaction, amount, recipient;
            beforeEach(() => {
                amount = 100;
                recipient = 'some-recipient';
                transaction = wallet.createTransaction({amount, recipient});
            });

            it('creates a new `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });
            it('is matching the transaction with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });
            it('outputs the amount to the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });
    
});

