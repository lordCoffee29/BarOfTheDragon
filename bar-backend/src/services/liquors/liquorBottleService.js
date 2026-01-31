import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { LiquorBottleModel } from '../../models/liquors/liquorBottleModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const LiquorBottleService = {
    async getAllLiquorBottles() {
        return LiquorBottleModel.getAll();
    },

    async getLiquorBottleByID(liquorBottleID) {
        const liquorBottle = await LiquorBottleModel.getByID(liquorBottleID);
        if(!liquorBottle) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return liquorBottle;
    },

    async createLiquorBottle(newLiquorBottle) {
        const { id, liquorID, transactionID, dateOpened, dateFinished, quantity } = newLiquorBottle;

        if( !id || !liquorID || !transactionID || !dateOpened || dateFinished || quantity) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdLiquorBottle = await LiquorBottleModel.create(newLiquorBottle);

        return createdLiquorBottle;
    },

    // Customize this logic
    async updateLiquorBottle(id, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedLiquorBottle = await LiquorBottleModel.update(id, newValues);
        
        if(!updatedLiquorBottle) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedLiquorBottle;
    },

    async deleteLiquorBottle(liquorBottleID) {
        const authenticatedUserID = 1;

        const liquorBottle = await LiquorBottleModel.getByID(liquorBottleID);

        if (!liquorBottle) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (liquorBottle.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await LiquorBottleModel.delete(liquorBottleID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Liquor bottle deleted successfully' };

    }
};