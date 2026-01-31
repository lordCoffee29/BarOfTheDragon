import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { DrinkVariantModel } from '../../models/drinks/variants/drinkVariantModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const DrinkVariantService = {
    async getAllDrinkVariants() {
        return DrinkVariantModel.getAll();
    },

    async getDrinkVariantByID(drinkVariantID) {
        const drinkVariant = await DrinkVariantModel.getByID(drinkVariantID);
        if(!drinkVarient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return drinkVariant;
    },

    async createDrinkVariant(newDrinkVariant) {
        const { id, drinkID, baseDrink, variantName, imgOverlayPath, notes } = newDrinkVariant;

        if( !id || !drinkID || !baseDrink || !variantName || !imgOverlayPath || !notes ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdDrinkVariant = await DrinkVariantModel.create(newDrinkVariant);

        return createdDrinkVariant;
    },

    // Customize this logic
    async updateDrinkVariant(id, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedDrinkVariant = await DrinkVariantModel.update(id, newValues);
        
        if(!updatedDrinkVariant) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedDrinkVariant;
    },

    async deleteDrinkVariant(id) {
        const authenticatedUserID = 1;

        const drinkVariant = await DrinkVariantModel.getByID(id);

        if (!drinkVariant) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (drinkVariant.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await DrinkVariantModel.delete(id);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Drink variant deleted successfully' };

    }
};