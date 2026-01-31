import { ToolTypeService } from "../../services/tools/toolTypeService.js";

export const ToolTypeController = {
    async getAllToolTypes(req, res, next) {
        try {
            const toolTypes = await ToolTypeService.getAllToolTypes();
            res.status(200).json(toolTypes);
        } catch (error) {
            next(error);
        }
    },

    async getToolTypeById(req, res, next) {
        try {
            const name = req.params.name;
            const toolType = await ToolTypeService.getToolTypeByID(name);
            res.status(200).json(toolType);
        } catch (error) {
            next(error);
        }
    },

    async createToolType(req, res, next) {
        try {
            const toolType = await ToolTypeService.createToolType(req.body);
            res.status(201).json(toolType);
        } catch (error) {
            next(error);
        }
    },

    async deleteToolType(req, res, next) {
        try {
            const name = req.params.name;
            const result = await ToolTypeService.deleteToolType(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
