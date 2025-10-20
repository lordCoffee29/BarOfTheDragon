import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { LiquorModel } from '../../models/liquors/liquorModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const LiquorService = {
    async getAllLiquors() {
        return LiquorModel.getAll();
    },

    async getLiquorByID(liquorID) {
        const liquor = await LiquorModel.getByID(liquorID);
        if(!liquor) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return liquor;
    },

    async createLiquor(newLiquor) {
        const { liquorID, brand, name, ml, ABV, imgPath, type, present } = newBase;

        if( !liquorID || !brand || !name || !ml || !ABV || !imgPath || !type || !present ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdLiquor = await LiquorModel.create(newLiquor);

        return createdLiquor;
    },

    // Customize this logic
    async updateLiquor(name, newValues) {
        const { brand, name, ml, ABV, imgPath, type, present } = newValues;

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
            UPDATE liquor 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `


        if(!brand && !name && !ml && !ABV && !imgPath && !type && !present) {
            throw new Error('Missing required fields');
        }

        const updatedLiquor = await LiquorModel.update(query, values);
        

        if(!updatedLiquor) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedLiquor;
    },

    async deleteLiquor(liquorID) {
        const authenticatedUserID = 1;

        const liquor = await LiquorModel.getByID(liquorID);

        if (!liquor) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (liquor.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await LiquorModel.delete(liquorID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Liquor deleted successfully' };

    }
};