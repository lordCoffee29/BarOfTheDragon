import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { IngredientModel } from '../../models/ingredients/ingredientModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const IngredientService = {
    async getAllIngredients() {
        return IngredientModel.getAll();
    },

    async getIngredientByID(ingredientID) {
        const ingredient = await IngredientModel.getByID(ingredientID);
        if(!ingredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return ingredient;
    },

    async createIngredient(newIngredient) {
        const { id, name, quantity, unit, brand, type, imgPath, present } = newIngredient;

        if( !id || !name || !quantity || !unit || !brand || !type || !imgPath || !present ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdIngredient = await IngredientModel.create(newIngredient);

        return createdIngredient;
    },

    // Customize this logic
    async updateIngredient(name, newValues) {
        const { name, quantity, unit, brand, type, imgPath, present } = newValues;

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
            UPDATE ingredient 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `


        if(!name && !quantity && !unit && !brand && !type && !imgPath && !present) {
            throw new Error('Missing required fields');
        }

        const updatedIngredient = await IngredientModel.update(query, values);
        

        if(!updatedIngredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedIngredient;
    },

    async deleteIngredient(ingredientID) {
        const authenticatedUserID = 1;

        const ingredient = await IngredientModel.getByID(ingredientID);

        if (!ingredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (ingredient.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await IngredientModel.delete(ingredientID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Ingredient deleted successfully' };

    }
};