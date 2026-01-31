import { BaseService } from "../../services/bases/baseService.js";

export const BaseController = {
    async getAllBases(req, res, next) {
        try {
            const bases = await BaseService.getAllBases();
            res.status(200).json(bases);
        } catch (error) {
            next(error);
        }
    },

    async getBaseById(req, res, next) {
        try {
            const baseID = parseInt(req.params.id);
            if (isNaN(baseID)) {
                return res.status(400).send({ message: 'Invalid base ID' });
            }
            const base = await BaseService.getBaseByID(baseID);
            res.status(200).json(base);
        } catch (error) {
            next(error);
        }
    },

    async createBase(req, res, next) {
        try {
            const base = await BaseService.createBase(req.body);
            res.status(201).json(base);
        } catch (error) {
            next(error);
        }
    },

    async updateBase(req, res, next) {
        try {
            const baseID = parseInt(req.params.id);
            const base = await BaseService.updateBase(baseID, req.body);
            res.status(200).json(base);
        } catch (error) {
            next(error);
        }
    },

    async deleteBase(req, res, next) {
        try {
            const baseID = parseInt(req.params.id);
            const result = await BaseService.deleteBase(baseID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
