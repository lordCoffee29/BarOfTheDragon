import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { DrinkVariantIngredientModel } from '../../models/drinks/variants/drinkVariantIngredientModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const DrinkVariantIngredientService = {
    async getAllDrinkVariantIngredients() {
        return DrinkVariantIngredientModel.getAll();
    },

    async getDrinkVariantIngredientByID(drinkVariantIngredientID) {
        const drinkVariantIngredient = await DrinkVariantIngredientModel.getByID(drinkVariantIngredientID);
        if(!drinkVarientIngredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return drinkVariantIngredient;
    },

    async createDrinkVariantIngredient(newDrinkVariantIngredient) {
        const { variantID, originalIngredient, replacementIngredient } = newDrinkVariantIngredient;

        if( !variantID || !originalIngredient || !replacementIngredient ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdDrinkVariantIngredient = await DrinkVariantIngredientModel.create(newDrinkVariantIngredient);

        return createdDrinkVariantIngredient;
    },

    // Customize this logic
    async updateDrinkVariantIngredient(variantID, originalIngredient, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedDrinkVariantIngredient = await DrinkVariantIngredientModel.update(variantID, originalIngredient, newValues);
        
        if(!updatedDrinkVariantIngredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedDrinkVariantIngredient;
    },

    async deleteDrinkVariantIngredient(variantID, originalIngredient) {
        const authenticatedUserID = 1;

        const drinkVariantIngredient = await DrinkVariantIngredientModel.getByID(variantID, originalIngredient);

        if (!drinkVariantIngredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (drinkVariantIngredient.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await DrinkVariantIngredientModel.delete(variantID, originalIngredient);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Drink variant ingredient deleted successfully' };

    }
};