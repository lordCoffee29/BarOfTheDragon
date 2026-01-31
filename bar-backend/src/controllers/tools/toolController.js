import { ToolService } from "../../services/tools/toolService.js";

export const ToolController = {
    async getAllTools(req, res, next) {
        try {
            const tools = await ToolService.getAllTools();
            res.status(200).json(tools);
        } catch (error) {
            next(error);
        }
    },

    async getToolById(req, res, next) {
        try {
            const name = req.params.name;
            const tool = await ToolService.getToolByID(name);
            res.status(200).json(tool);
        } catch (error) {
            next(error);
        }
    },

    async createTool(req, res, next) {
        try {
            const tool = await ToolService.createTool(req.body);
            res.status(201).json(tool);
        } catch (error) {
            next(error);
        }
    },

    async updateTool(req, res, next) {
        try {
            const name = req.params.name;
            const tool = await ToolService.updateTool(name, req.body);
            res.status(200).json(tool);
        } catch (error) {
            next(error);
        }
    },

    async deleteTool(req, res, next) {
        try {
            const name = req.params.name;
            const result = await ToolService.deleteTool(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
