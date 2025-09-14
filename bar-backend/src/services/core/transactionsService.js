import { TransactionModel } from '../../models/core/transactionsModel.js';

// Clean up + do operations here, basically backend logic to format for database

export const TransactionService = {
    async getAllTransactions() {
        return TransactionModel.getAll();
    },

    async getTransactionByID(transactionID) {
        const transaction = await TransactionModel.getByID(transactionID);
        if(!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    },

    async createTransaction(newTransaction) {
        const { item, brand, category, date, price } = newTransaction;

        if(!item || !brand || !category || !date || !price) {
            throw new Error('Missing required fields');
        }

        const createdTransaction = await TransactionModel.create(newTransaction);

        return createdTransaction;
    },

    async updateTransaction(transactionID, newValues) {
        const { item, brand, category, date, price } = newValues;

        if(!item || !brand || !category || !date || !price) {
            throw new Error('Missing required fields');
        }

        const field = Object.keys(newValues);

        const updatedTransaction = await TransactionModel.update(transactionID, newValues);

        if(!updatedTransaction) {
            throw new Error('Transaction not found');
        }

        return updatedTransaction;
    }
        // const transactionID = parseInt(req.params.id);
        // res.send(`Update existing transaction: ${transactionID}`);
    },

    async deleteTransaction(req, res) {
        const transactionID = parseInt(req.params.id);
        res.send(`Delete old transaction: ${transactionID}`);
    }
};