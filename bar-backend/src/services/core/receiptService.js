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
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return receipt;
    },

    async createReceipt(newReceipt) {
        const { date, createdAt } = newReceipt;
        if( !date || !createdAt ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdReceipt = await ReceiptModel.create(newReceipt);

        return createdReceipt;
    },

    async deleteReceipt(id) {
        const authenticatedUserID = 1;

        const receipt = await ReceiptModel.getByID(id);

        if (!receipt) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (receipt.user_id !== authenticatedUserID) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await ReceiptModel.delete(id);
        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Receipt deleted successfully' };

    }
};