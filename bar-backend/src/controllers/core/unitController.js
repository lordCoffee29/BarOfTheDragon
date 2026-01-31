import { UnitService } from "../../services/core/unitService.js";

export const UnitController = {
    async getAllUnits(req, res, next) {
        try {
            const units = await UnitService.getAllUnits();
            res.status(200).json(units);
        } catch (error) {
            next(error);
        }
    },

    async getUnitById(req, res, next) {
        try {
            const name = req.params.name;
            const unit = await UnitService.getUnitByID(name);
            res.status(200).json(unit);
        } catch (error) {
            next(error);
        }
    },

    async createUnit(req, res, next) {
        try {
            const unit = await UnitService.createUnit(req.body);
            res.status(201).json(unit);
        } catch (error) {
            next(error);
        }
    },

    async updateUnit(req, res, next) {
        try {
            const name = req.params.name;
            const unit = await UnitService.updateUnit(name, req.body);
            res.status(200).json(unit);
        } catch (error) {
            next(error);
        }
    },

    async deleteUnit(req, res, next) {
        try {
            const name = req.params.name;
            const result = await UnitService.deleteUnit(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
