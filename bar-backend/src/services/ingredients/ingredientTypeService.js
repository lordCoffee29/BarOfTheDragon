import ERROR_MESSAGES from "../../constants/errorMessages.js";
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const IngredientTypeService = {
    async getAllIngredientTypes() {
        return IngredientTypeModel.getAll();
    },

    async getIngredientTypeByID(name) {
        const ingredientType = await IngredientTypeModel.getByID(name);
        if(!ingredientType) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return ingredientType;
    },

    async createIngredientType(newIngredientType) {
        const { name } = newIngredientType;

        if( !name ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdIngredientType = await IngredientTypeModel.create(newIngredientType);

        return createdIngredientType;
    },

    // Customize this logic
    // Might not be a need to update since it's one attribute
    // async updateBaseType(name, newValues) {
    //     const { name } = newValues;

    //     const fields = Object.keys(newValues);
    //     const values = Object.values(newValues);
    //     values.push(id); // For the WHERE clause

    //     console.log(fields);
    //     console.log(values);

    //     const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
    //     // console.log(setClause);
    //     console.log(setClause);

    //     // This ID mechanism is more secure against SQL injection
    //     const query = `
    //         UPDATE base 
    //         SET ${setClause} 
    //         WHERE id = $${values.length}
    //         RETURNING *
    //     `


    //     if(!baseID && !transactionID && !dateOpened && !dateFinished && !quantity) {
    //         throw new Error('Missing required fields');
    //     }

    //     const updatedBase = await BaseModel.update(query, values);
        

    //     if(!updatedBase) {
    //         throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
    //     }

    //     return updatedBase;
    // },

    async deleteIngredientType(name) {
        const authenticatedUserID = 1;

        const ingredientType = await IngredientTypeModel.getByID(name);

        if (!ingredientType) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (ingredientType.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await IngredientTypeModel.delete(name);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Ingredient type deleted successfully' };

    }
};