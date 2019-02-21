const Transaction = require('./transaction');

class TransactionPool {
    constructor(){
        this.transactionMap = {};
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({inputAddress}){
        const transactions = Object.values(this.transactionMap);
        return transactions.find((transaction) => {
            return  transaction.input.address === inputAddress;
        });
    }

    setTransactionPool(transactionPool){
        this.transactionMap = transactionPool; 
    }

    validTransactions(){
        return Object.values(this.transactionMap).filter(transaction => {
            return Transaction.validTransaction(transaction);
        });
    }
}

module.exports = TransactionPool;