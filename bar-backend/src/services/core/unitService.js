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
        const { type, baseUnit, multiplier } = newValues;

        const fields = Object.keys(newValues);
        const values = Object.values(newValues);
        values.push(name); // For the WHERE clause

        console.log(fields);
        console.log(values);

        const setClause = fields.map((key, index) => `${key} = $${index + 1}`).join(', ');
        // console.log(setClause);
        console.log(setClause);

        // This ID mechanism is more secure against SQL injection
        const query = `
            UPDATE units 
            SET ${setClause} 
            WHERE name = $${values.length}
            RETURNING *
        `


        if(!type && !baseUnit && !multiplier) {
            throw new Error('Missing required fields');
        }

        const updatedUnit = await UnitModel.update(query, values);
        

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