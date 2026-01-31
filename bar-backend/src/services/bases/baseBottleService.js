import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { BaseBottleModel } from '../../models/bases/baseBottleModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const BaseBottleService = {
    async getAllBaseBottles() {
        return BaseBottleModel.getAll();
    },

    async getBaseBottleByID(baseBottleID) {
        const baseBottle = await BaseBottleModel.getByID(baseBottleID);
        if(!baseBottle) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return baseBottle;
    },

    async createBaseBottle(newBaseBottle) {
        const { id, baseID, transactionID, dateOpened, dateFinished, quantity } = newBaseBottle;

        if( !id || !baseID || !transactionID || !dateOpened || dateFinished || quantity) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdBaseBottle = await BaseBottleModel.create(newBaseBottle);

        return createdBaseBottle;
    },

    // Customize this logic
    async updateBaseBottle(id, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedBaseBottle = await BaseBottleModel.update(id, newValues);
        
        if(!updatedBaseBottle) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedBaseBottle;
    },

    async deleteBaseBottle(baseBottleID) {
        const authenticatedUserID = 1;

        const baseBottle = await BaseBottleModel.getByID(baseBottleID);

        if (!baseBottle) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (baseBottle.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await BaseBottleModel.delete(baseBottleID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Base bottle deleted successfully' };

    }
};