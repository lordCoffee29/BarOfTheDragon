import { BaseBottleService } from "../../services/bases/baseBottleService.js";

export const BaseBottleController = {
    async getAllBaseBottles(req, res, next) {
        try {
            const baseBottles = await BaseBottleService.getAllBaseBottles();
            res.status(200).json(baseBottles);
        } catch (error) {
            next(error);
        }
    },

    async getBaseBottleById(req, res, next) {
        try {
            const baseBottleID = parseInt(req.params.id);
            if (isNaN(baseBottleID)) {
                return res.status(400).send({ message: 'Invalid base bottle ID' });
            }
            const baseBottle = await BaseBottleService.getBaseBottleByID(baseBottleID);
            res.status(200).json(baseBottle);
        } catch (error) {
            next(error);
        }
    },

    async createBaseBottle(req, res, next) {
        try {
            const baseBottle = await BaseBottleService.createBaseBottle(req.body);
            res.status(201).json(baseBottle);
        } catch (error) {
            next(error);
        }
    },

    async updateBaseBottle(req, res, next) {
        try {
            const baseBottleID = parseInt(req.params.id);
            const baseBottle = await BaseBottleService.updateBaseBottle(baseBottleID, req.body);
            res.status(200).json(baseBottle);
        } catch (error) {
            next(error);
        }
    },

    async deleteBaseBottle(req, res, next) {
        try {
            const baseBottleID = parseInt(req.params.id);
            const result = await BaseBottleService.deleteBaseBottle(baseBottleID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
