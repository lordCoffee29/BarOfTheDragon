import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { BaseModel } from '../../models/bases/baseModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const BaseService = {
    async getAllBases() {
        return BaseModel.getAll();
    },

    async getBaseByID(baseID) {
        const base = await BaseModel.getByID(baseID);
        if(!base) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return base;
    },

    async createBase(newBase) {
        const { baseID, brand, name, ml, imgPath, type, present } = newBase;

        if( !baseID || !brand || !name || !ml || imgPath || type || present ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdBase = await BaseModel.create(newBase);

        return createdBase;
    },

    // Customize this logic
    async updateBase(id, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedBase = await BaseModel.update(id, newValues);
        
        if(!updatedBase) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedBase;
    },

    async deleteBase(baseID) {
        const authenticatedUserID = 1;

        const base = await BaseModel.getByID(baseID);

        if (!base) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (base.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await BaseModel.delete(baseID);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Base deleted successfully' };

    }
};