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
    async updateIngredient(id, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedIngredient = await IngredientModel.update(id, newValues);
        
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