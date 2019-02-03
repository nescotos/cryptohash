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
}

module.exports = TransactionPool;