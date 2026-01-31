import { BaseTypeService } from "../../services/bases/baseTypeService.js";

export const BaseTypeController = {
    async getAllBaseTypes(req, res, next) {
        try {
            const baseTypes = await BaseTypeService.getAllBaseTypes();
            res.status(200).json(baseTypes);
        } catch (error) {
            next(error);
        }
    },

    async getBaseTypeById(req, res, next) {
        try {
            const name = req.params.name;
            const baseType = await BaseTypeService.getBaseTypeByID(name);
            res.status(200).json(baseType);
        } catch (error) {
            next(error);
        }
    },

    async createBaseType(req, res, next) {
        try {
            const baseType = await BaseTypeService.createBaseType(req.body);
            res.status(201).json(baseType);
        } catch (error) {
            next(error);
        }
    },

    async deleteBaseType(req, res, next) {
        try {
            const name = req.params.name;
            const result = await BaseTypeService.deleteBaseType(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
