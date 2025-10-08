import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { TransactionModel } from '../../models/core/transactionsModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const TransactionService = {
    async getAllTransactions() {
        return TransactionModel.getAll();
    },

    async getTransactionByID(transactionID) {
        const transaction = await TransactionModel.getByID(transactionID);
        if(!transaction) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return transaction;
    },

    async createTransaction(newTransaction) {
        const { item, brand, category, date, price } = newTransaction;

        if(!item || !brand || !category || !date || !price) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdTransaction = await TransactionModel.create(newTransaction);

        return createdTransaction;
    },

    // Customize this logic
    async updateTransaction(transactionID, newValues) {
        const { item, brand, category, date, price } = newValues;

        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(transactionID); // For the WHERE clause

        console.log(fields);
        console.log(values);

        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        // console.log(setClause);
        console.log(setClause);

        // This ID mechanism is more secure against SQL injection
        const query = `
            UPDATE Transactions 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `


        if(!item && !brand && !category && !date && !price) {
            throw new Error('Missing required fields');
        }

        const updatedTransaction = await TransactionModel.update(query, values);
        

        if(!updatedTransaction) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedTransaction;
    },
        // const transactionID = parseInt(req.params.id);
        // res.send(`Update existing transaction: ${transactionID}`);

    async deleteTransaction(transactionID) {
        const authenticatedUserID = 1;

        const transaction = await TransactionModel.getByID(transactionID);

        if (!transaction) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (transaction.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await TransactionModel.delete(transactionID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Transaction deleted successfully' };

        // const transactionID = parseInt(req.params.id);
        // res.send(`Delete old transaction: ${transactionID}`);
    }
};