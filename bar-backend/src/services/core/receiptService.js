import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { ReceiptModel } from '../../models/core/receiptModel.js';
// import CustomError from "../../utils/CustomError.js";

export const ReceiptService = {
    async getAllReceipts() {
        return ReceiptModel.getAll();
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

    async createReceipt(newReceipt) {
        const { date } = newReceipt;
        if (!date) {
            const error = new Error('Date is required');
            error.statusCode = 400;
            throw error;
        }

        const createdReceipt = await ReceiptModel.create({ date });

        return createdReceipt;
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