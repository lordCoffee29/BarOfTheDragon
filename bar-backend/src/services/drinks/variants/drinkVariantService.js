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
    async updateDrinkVariant(name, newValues) {
        const { drinkID, baseDrink, variantName, imgOverlayPath, notes } = newValues;

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
            UPDATE drink_variant
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `


        if(!variantID && !originalIngredient && !replacementIngredient) {
            throw new Error('Missing required fields');
        }

        const updatedDrinkVariant = await DrinkVariantModel.update(query, values);
        

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