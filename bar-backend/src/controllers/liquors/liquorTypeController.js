import { LiquorTypeService } from "../../services/liquors/liquorTypeService.js";

export const LiquorTypeController = {
    async getAllLiquorTypes(req, res, next) {
        try {
            const liquorTypes = await LiquorTypeService.getAllLiquorTypes();
            res.status(200).json(liquorTypes);
        } catch (error) {
            next(error);
        }
    },

    async getLiquorTypeById(req, res, next) {
        try {
            const name = req.params.name;
            const liquorType = await LiquorTypeService.getLiquorTypeByID(name);
            res.status(200).json(liquorType);
        } catch (error) {
            next(error);
        }
    },

    async createLiquorType(req, res, next) {
        try {
            const liquorType = await LiquorTypeService.createLiquorType(req.body);
            res.status(201).json(liquorType);
        } catch (error) {
            next(error);
        }
    },

    async deleteLiquorType(req, res, next) {
        try {
            const name = req.params.name;
            const result = await LiquorTypeService.deleteLiquorType(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
