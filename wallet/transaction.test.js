const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../utils');
const { REWARD, REWARD_RATE } = require('../config');

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-pubkey';
        amount = 50;
        transaction = new Transaction({ senderWallet, recipient, amount});
    });

    it('the transaction should have and `id`', () => {
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap', () => {
        it('should have an `outputMap`', () => {
            expect(transaction).toHaveProperty('outputMap');
        });
        it('should outpus the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount); 
        });

        it('should output the remaining balance of the wallet', () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        });
    });

    describe('input', () => {
        it('should have the `input` data', () => {
            expect(transaction.input).toHaveProperty('timestamp');
        });
        it('should have `timestamp` property', () => {
            expect(transaction).toHaveProperty('input');
        });
        it('should set amount to the senderWallet balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });
        it('should set the address to the senderWallet publicKey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });
        it('should sign the input', () => {
            expect(verifySignature({
                publicKey: senderWallet.publicKey,
                data: transaction.outputMap,
                signature: transaction.input.signature
            })).toBe(true);
        });
    });

    describe('validTransaction()', () => {
        let errorMock;

        beforeEach(() => {
            errorMock = jest.fn();

            global.console.error = errorMock;
        });

        describe('when the transaction is valid', () => {
            it('returns true', () => {
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        });

        describe('when the transaction is invalid', () => {
            describe('and a transaction outputMap value is invalid', () => {
                it('returns false and logs an error', () => {
                    transaction.outputMap[senderWallet.publicKey] = 999999;

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the transaction input signature is invalid', () => {
                it('returns false and logs an error', () => {
                    transaction.input.signature = new Wallet().sign('data');

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe('update', () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

        describe('the amount is invalid', () => {
            it('should theow an error', () => {
                expect(() => {
                    transaction.update({senderWallet, recipient: 'foo', amount: 950000})
                }).toThrow('Amount exceeds balance');
            });
        });

        describe('the amont is valid', () => {
            beforeEach(() => {
                originalSignature = transaction.input.signature;
                originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
                nextRecipient = 'my-next-recipient';
                nextAmount = 100;
                transaction.update({ senderWallet, recipient: nextRecipient, amount: nextAmount });
            });

            it('should output the amount of the next recipient', () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount)
            });
            it('should substract the amount from the original sender output', () => {
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
            });
            it('should match the total output from the input amount', () => {
                expect(
                    Object.values(transaction.outputMap)
                        .reduce((total, outAmount) => total + outAmount)
                ).toEqual(transaction.input.amount);
            });
            it('should re-sign the transaction', () => {
                expect(transaction.input.signature).not.toEqual(originalSignature);
            });
            describe('an update to the same recipient', () => {
                let addedAmount;
                beforeEach(() => {
                    addedAmount = 25;
                    transaction.update({
                        senderWallet, recipient: nextRecipient, amount: addedAmount
                    });
                });

                it('should add to the recipient the updated amount', () => {
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addedAmount);
                });

                it('should substract the amount fron the sender', () => {
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual( originalSenderOutput - nextAmount - addedAmount)
                });
            });
        });
        
    });

    describe('rewardTransaction()', () => {
        let minerWallet, rewardTransaction;

        beforeEach(() => {
            minerWallet = new Wallet();
            rewardTransaction = Transaction.rewardTransaction({minerWallet});
        });

        it('should create a transaction with the correct reward', () => {
            expect(rewardTransaction.input).toEqual(REWARD);
        });

        it('should create a transaction reward for the miner', () => {
            expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(REWARD_RATE);
        });
    });
    
});