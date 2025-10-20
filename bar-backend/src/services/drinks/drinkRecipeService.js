import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { DrinkRecipeModel } from '../../models/drinks/drinkModel.js';
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
    async updateBase(name, newValues) {
        const { name, ingredient, quantity, unit } = newValues;

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
            UPDATE drink_recipe 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `


        if(!name && !ingredient && !quantity && !unit) {
            throw new Error('Missing required fields');
        }

        const updatedDrinkRecipe = await DrinkRecipeModel.update(query, values);
        

        if(!updatedDrinkRecipe) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedDrinkRecipe;
    },

    async deleteBase(ID) {
        const authenticatedUserID = 1;

        const drinkRecipe = await DrinkRecipeModel.getByID(ID);

        if (!drinkRecipe) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (drinkRecipe.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await DrinkRecipeModel.delete(ID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Drink recipe deleted successfully' };

    }
};