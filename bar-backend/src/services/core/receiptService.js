import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { ReceiptModel } from '../../models/core/receiptModel.js';
// import CustomError from "../../utils/CustomError.js";

export const ReceiptService = {
    async getAllReceipts() {
        return ReceiptModel.getAll();
    },

    async getListView(filters) {
        const receipts = await ReceiptModel.getListView(filters);
        if(!receipts) {
            const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
            error.statusCode = 404;
            throw error;
        }
        return receipts;
    },

    async getReceiptByID(receiptID) {
        const receipt = await ReceiptModel.getByID(receiptID);
        if(!receipt) {
            const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
            error.statusCode = 404;
            throw error;
        }
        return receipt;
    },

    async getTransactionsByReceiptDate(date) {
        console.log("Service: ", date);
        const transactions = await ReceiptModel.getTransactionsByReceiptDate(date);
        if(!transactions) {
            const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
            error.statusCode = 404;
            throw error;
        }
        return transactions;
    },

    async createReceipt(newReceipt) {
        const { date, store_loc } = newReceipt;
        console.log("Service: createReceipt called with:", newReceipt);

        if (!date || !store_loc) {
            const error = new Error('Date and store location are required');
            error.statusCode = 400;
            throw error;
        }

        const createdReceipt = await ReceiptModel.create({ date, store_loc });

        return createdReceipt;
    },

    async updateREceipt(id, updatedData) {
        const receipt = await ReceiptModel.getByID(id);

        if (!receipt) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        // Assuming only date can be updated for simplicity
        const { date, store_loc } = updatedData;
        if (!date || !store_loc) {
            const error = new Error('Date and store location are required for update');
            error.statusCode = 400;
            throw error;
        }

        // Here you would typically call an update method on the model
        await ReceiptModel.update(id, { date });

        // Since the update method is not defined in the model, we'll just return a success message
        return { message: 'Receipt updated successfully' };
    },

    async deleteReceipt(id) {
        const receipt = await ReceiptModel.getByID(id);

        if (!receipt) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        const rowCount = await ReceiptModel.delete(id);
        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Receipt deleted successfully' };

    }
};