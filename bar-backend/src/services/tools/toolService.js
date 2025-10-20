import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { ToolModel } from '../../models/tools/toolModel.js';
// import CustomError from "../../utils/CustomError.js";

// Clean up + do operations here, basically backend logic to format for database
// TO-DO: replace error handling

export const ToolService = {
    async getAllTools() {
        return ToolModel.getAll();
    },

    async getToolByID(name) {
        const tool = await ToolModel.getByID(toolID);
        if(!tool) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return tool;
    },

    async createTool(newTool) {
        const { name, transactionID, quantity, unit, type } = newBase;

        if( !name || !transactionID || !quantity || !unit || !type ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdTool = await ToolModel.create(newTool);

        return createdTool;
    },

    // Customize this logic
    async updateTool(name, newValues) {
        const { name, transactionID, quantity, unit, type } = newValues;

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
            UPDATE tool 
            SET ${setClause} 
            WHERE id = $${values.length}
            RETURNING *
        `


        if(!name && !transactionID && !quantity && !unit && !type) {
            throw new Error('Missing required fields');
        }

        const updatedTool = await ToolModel.update(query, values);
        

        if(!updatedTool) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedTool;
    },

    async deleteTool(name) {
        const authenticatedUserID = 1;

        const tool = await ToolModel.getByID(name);

        if (!tool) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        };

        if (tool.user_id !== autenticatedUserId) {
            throw new Error(ERROR_MESSAGES.FORBIDDEN, 403);
        };

        const rowCount = await ToolModel.delete(name);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Tool deleted successfully' };

    }
};