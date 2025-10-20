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
    async updateDrinkVariantIngredient(name, newValues) {
        const { variantID, originalIngredient, replacementIngredient } = newValues;

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
            UPDATE drink_variant_ingredient 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `


        if(!variantID && !originalIngredient && !replacementIngredient) {
            throw new Error('Missing required fields');
        }

        const updatedDrinkVariantIngredient = await DrinkVariantIngredientModel.update(query, values);
        

        if(!updatedDrinkVariantIngredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedDrinkVariantIngredient;
    },

    async deleteDrinkVariantIngredient(variantID) {
        const authenticatedUserID = 1;

        const drinkVariantIngredient = await DrinkVariantIngredientModel.getByID(variantID);

        if (!drinkVariantIngredient) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (drinkVariantIngredient.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await DrinkVariantIngredientModel.delete(variantID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Drink variant ingredient deleted successfully' };

    }
};