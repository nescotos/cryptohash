const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TrasactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'some-recipient',
            amount: 10
        });
    });

    describe('setTransaction()', () => {
        it('it should add a new trasaction', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('should return an existing transaction if it exists', () => {
            transactionPool.setTransaction(transaction);
            expect(
                transactionPool.existingTransaction({inputAddress: senderWallet.publicKey})
            ).toBe(transaction);
        });
    });

    describe('validTransactions()', () => {
        let validTransactions;
        let errorMock = jest.fn();
        global.console.error = errorMock;

        beforeEach(() => {
            validTransactions = [];

            for(let i = 0; i < 10; i++){
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'hello',
                    amount: 50
                });

                if(i%3 === 0){
                    transaction.input.amount = 100000000;
                }else if (i % 3 === 0){
                    transaction.input.signature = new Wallet().sign('foo-data');
                } else{
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('should return the valid transactions', ()  => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('the errors should be called', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });
});