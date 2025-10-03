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

    // Customize this logic
    async updateTransaction(transactionID, newValues) {
        const { item, brand, category, date, price } = newValues;

        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        // values.push(transactionID); // For the WHERE clause

        console.log(fields);
        console.log(values);

        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        // console.log(setClause);
        console.log(setClause);

        // This ID mechanism is more secure against SQL injection
        const query = `
            UPDATE Transactions 
            SET ${setClause} 
            WHERE id = ${transactionID}
            RETURNING *
        `


        if(!item && !brand && !category && !date && !price) {
            throw new Error('Missing required fields');
        }

        const updatedTransaction = await TransactionModel.update(query, values);
        

        if(!updatedTransaction) {
            throw new Error('Transaction not found');
        }

        return updatedTransaction;
    },
        // const transactionID = parseInt(req.params.id);
        // res.send(`Update existing transaction: ${transactionID}`);

    async deleteTransaction(transactionID) {
        const authenticatedUserID = 1;

        const transaction = await TransactionModel.getByID(transactionID);

        if (!transaction) {
            throw new Error('Transaction not found');
        };

        if (transaction.user_id !== autenticatedUserId) {
            throw new Error('Unauthorized to delete this transaction');
        };

        const rowCount = await TransactionModel.delete(transactionID);

        if(rowCount === 0) {
            throw new Error('Transaction not found or already deleted');
        }

        return { message: 'Transaction deleted successfully' };

        // const transactionID = parseInt(req.params.id);
        // res.send(`Delete old transaction: ${transactionID}`);
    }
};