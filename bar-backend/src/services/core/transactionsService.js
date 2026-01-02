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

    async getTransactionsByFilterAndSort(filters) {
        console.log("Service layer: ", filters);
        const transaction = await TransactionModel.getByFilterAndSort(filters);
        if(!transaction) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return transaction;
    },

    async getAutoPrice(filters) {
        console.log("Service layer activated");
        const { item, brand } = filters;

        const price = await TransactionModel.getAutoPrice(item, brand);
        if(!price) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return price;
    },

    async getSorted(sortBy, sortOrder) {
        let validBy = ['id', 'item', 'brand', 'category', 'date', 'price'];
        let validSortOrder = ['ASC', 'DESC'];
        if (!validBy.includes(sortBy)) {
            throw new Error('Invalid sort by field');
        }
        if (!validSortOrder.includes(sortOrder)) {
            throw new Error('Invalid sort order');
        }

        const sorted = await TransactionModel.getSorted(sortBy, sortOrder);
        if(!sorted) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return sorted;
    },

    async createTransaction(newTransaction) {
        console.log("Service: createTransaction called");
        console.log("Service received:", newTransaction);

        try {
            const { receipt_id, line_num, item, brand, category, date, price, note, created_at, updated_at } = newTransaction;

            // Convert dates properly
            let convertedDate = null;
            if (date) {
                convertedDate = new Date(date);
                if (isNaN(convertedDate.getTime())) {
                    throw new Error('Invalid date format');
                }
            }

            let convertedCreatedDate = null;
            if (date) {
                convertedCreatedDate = new Date(date);
                if (isNaN(convertedCreatedDate.getTime())) {
                    throw new Error('Invalid created date format');
                }
            }

            let convertedUpdatedDate = null;
            if (updated_at) {
                if (updated_at) {
                    convertedUpdatedDate = new Date(updated_at);
                    if (isNaN(convertedUpdatedDate.getTime())) {
                        throw new Error('Invalid updated date format');
                    }
                }
            }

            console.log("Transaction debugging");
            console.log("Original date:", date);
            console.log("Converted date:", convertedDate);

            const sendTransaction = {
                receipt_id,
                line_num,
                item,
                brand,
                category,
                date: convertedDate,
                price,
                note,
                created_at: convertedCreatedDate,
                updated_at: convertedUpdatedDate
            };

            console.log("Sending to model:", sendTransaction);

            const createdTransaction = await TransactionModel.create(sendTransaction);
            console.log("Model returned:", createdTransaction);

            return createdTransaction;
        } catch (error) {
            console.error("Error in createTransaction service:", error);
            throw error;
        }
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