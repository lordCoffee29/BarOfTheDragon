import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { UnitModel } from '../../models/core/unitModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const UnitService = {
    async getAllUnits() {
        return UnitModel.getAll();
    },

    async getUnitByID(unitID) {
        const unit = await UnitModel.getByID(unitID);
        if(!unit) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return unit;
    },

    async createUnit(newUnit) {
        const { name, type, baseUnit, multiplier } = newUnit;

        if( !name || !type || !baseUnit || !multiplier ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdUnit = await UnitModel.create(newUnit);

        return createdUnit;
    },

    // Customize this logic
    async updateUnit(name, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedUnit = await UnitModel.update(name, newValues);
        
        if(!updatedUnit) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedUnit;
    },

    async deleteUnit(name) {
        const authenticatedUserID = 1;

        const unit = await UnitModel.getByID(name);

        if (!unit) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (unit.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await UnitModel.delete(name);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Unit deleted successfully' };

    }
};