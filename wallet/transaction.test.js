const Transaction = require('./transaction');
const Wallet = require('./index');

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
    
});