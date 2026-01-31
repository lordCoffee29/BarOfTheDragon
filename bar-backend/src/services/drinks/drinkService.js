import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { DrinkModel } from '../../models/drinks/drinkModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const DrinkService = {
    async getAllDrinks() {
        return DrinkModel.getAll();
    },

    async getDrinkByID(name) {
        const drinkType = await DrinkModel.getByID(name);
        if(!drinkType) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return drinkType;
    },

    async createDrink(newDrink) {
        const { name } = newDrink;

        if( !name ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdDrink = await DrinkModel.create(newDrink);

        return createdDrink;
    },

    // Customize this logic
    async updateDrink(name, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedDrink = await DrinkModel.update(name, newValues);
        
        if(!updatedDrink) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedDrink;
    },

    async deleteDrink(name) {
        const authenticatedUserID = 1;

        const drinkType = await DrinkModel.getByID(name);

        if (!drinkType) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (drinkType.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await DrinkModel.delete(name);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Drink deleted successfully' };

    }
};