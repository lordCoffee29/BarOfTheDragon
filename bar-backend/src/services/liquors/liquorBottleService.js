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
    async updateLiquorBottle(name, newValues) {
        const { liquorID, transactionID, dateOpened, dateFinished, quantity } = newValues;

        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(id); // For the WHERE clause

        console.log(fields);
        console.log(values);

        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        // console.log(setClause);
        console.log(setClause);

        // This ID mechanism is more secure against SQL injection
        const query = `
            UPDATE liquor_bottle 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `


        if(!liquorID && !transactionID && !dateOpened && !dateFinished && !quantity) {
            throw new Error('Missing required fields');
        }

        const updatedLiquorBottle = await LiquorBottleModel.update(query, values);
        

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