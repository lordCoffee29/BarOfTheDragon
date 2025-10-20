import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { LiquorTypeModel } from '../../models/liquors/liquorTypeModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const LiquorTypeService = {
    async getAllLiquorTypes() {
        return LiquorTypeModel.getAll();
    },

    async getLiquorTypeByID(name) {
        const liquorType = await LiquorTypeModel.getByID(name);
        if(!liquorType) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return liquorType;
    },

    async createLiquorType(newLiquorType) {
        const { name } = newLiquorType;

        if( !name ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdLiquorType = await LiquorTypeModel.create(newLiquorType);

        return createdLiquorType;
    },

    // Customize this logic
    // Might not be a need to update since it's one attribute
    // async updateBaseType(name, newValues) {
    //     const { name } = newValues;

    //     const fields = Object.keys(newValues);
    //     const values = Object.values(newValues);
    //     values.push(id); // For the WHERE clause

    //     console.log(fields);
    //     console.log(values);

    //     const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
    //     // console.log(setClause);
    //     console.log(setClause);

    //     // This ID mechanism is more secure against SQL injection
    //     const query = `
    //         UPDATE base 
    //         SET ${setClause} 
    //         WHERE id = $${values.length}
    //         RETURNING *
    //     `


    //     if(!baseID && !transactionID && !dateOpened && !dateFinished && !quantity) {
    //         throw new Error('Missing required fields');
    //     }

    //     const updatedBase = await BaseModel.update(query, values);
        

    //     if(!updatedBase) {
    //         throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
    //     }

    //     return updatedBase;
    // },

    async deleteLiquorType(name) {
        const authenticatedUserID = 1;

        const liquorType = await LiquorTypeModel.getByID(name);

        if (!liquorType) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (liquorType.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await LiquorTypeModel.delete(name);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Liquor type deleted successfully' };

    }
};