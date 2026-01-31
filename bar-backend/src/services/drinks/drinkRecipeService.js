import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { DrinkRecipeModel } from '../../models/drinks/drinkRecipeModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const DrinkRecipeService = {
    async getAllDrinkRecipes() {
        return DrinkRecipeModel.getAll();
    },

    async getDrinkRecipeByID(drinkRecipeID) {
        const drinkRecipe = await DrinkRecipeModel.getByID(drinkRecipeID);
        if(!drinkRecipe) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return drinkRecipe;
    },

    async createDrinkRecipe(newDrinkRecipe) {
        const { ID, name, ingredient, quantity, unit } = newDrinkRecipe;

        if( !ID || !name || !ingredient || !quantity || unit ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdDrinkRecipe = await DrinkRecipeModel.create(newDrinkRecipe);

        return createdDrinkRecipe;
    },

    // Customize this logic
    async updateDrinkRecipe(id, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedDrinkRecipe = await DrinkRecipeModel.update(id, newValues);
        
        if(!updatedDrinkRecipe) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedDrinkRecipe;
    },

    async deleteDrinkRecipe(id) {
        const authenticatedUserID = 1;

        const drinkRecipe = await DrinkRecipeModel.getByID(id);

        if (!drinkRecipe) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (drinkRecipe.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await DrinkRecipeModel.delete(id);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Drink recipe deleted successfully' };

    }
};