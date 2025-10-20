import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { IngredientItemModel } from '../../models/igredients/ingredientItemModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const IngredientItemService = {
    async getAllIngredientItems() {
        return IngredientItemModel.getAll();
    },

    async getIngredientItemByID(ingredientItemID) {
        const ingredientItem = await IngredientItemModel.getByID(ingredientItemID);
        if(!ingredientItem) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return ingredientItem;
    },

    async createIngredientItem(newIngredientItem) {
        const { id, brand, name, quantity, unit, transactionID, dateOpened, dateFinished } = newBaseBottle;

        if( !id || !brand || !name || !quantity || unit || transactionID || dateOpened || dateFinished) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdIngredientItem = await IngredientItemModel.create(newIngredientItem);

        return createdIngredientItem;
    },

    // Customize this logic
    async updateIngredientItem(name, newValues) {
        const { brand, name, quantity, unit, transactionID, dateOpened, dateFinished } = newValues;

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
            UPDATE ingredient_item 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `


        if(!brand && !name && !quantity && !unit && !transactionID && !dateOpened && !dateFinished) {
            throw new Error('Missing required fields');
        }

        const updatedIngredientItem = await IngredientItemModel.update(query, values);
        

        if(!updatedIngredientItem) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedIngredientItem;
    },

    async deleteIngredientItem(ingredientItemID) {
        const authenticatedUserID = 1;

        const ingredientItem = await IngredientItemModel.getByID(ingredientItemID);

        if (!ingredientItem) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (ingredientItem.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await IngredientItemModel.delete(ingredientItemID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Ingredient item deleted successfully' };

    }
};