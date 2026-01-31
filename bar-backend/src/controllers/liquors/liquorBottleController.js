import { LiquorBottleService } from "../../services/liquors/liquorBottleService.js";

export const LiquorBottleController = {
    async getAllLiquorBottles(req, res, next) {
        try {
            const liquorBottles = await LiquorBottleService.getAllLiquorBottles();
            res.status(200).json(liquorBottles);
        } catch (error) {
            next(error);
        }
    },

    async getLiquorBottleById(req, res, next) {
        try {
            const liquorBottleID = parseInt(req.params.id);
            if (isNaN(liquorBottleID)) {
                return res.status(400).send({ message: 'Invalid liquor bottle ID' });
            }
            const liquorBottle = await LiquorBottleService.getLiquorBottleByID(liquorBottleID);
            res.status(200).json(liquorBottle);
        } catch (error) {
            next(error);
        }
    },

    async createLiquorBottle(req, res, next) {
        try {
            const liquorBottle = await LiquorBottleService.createLiquorBottle(req.body);
            res.status(201).json(liquorBottle);
        } catch (error) {
            next(error);
        }
    },

    async updateLiquorBottle(req, res, next) {
        try {
            const liquorBottleID = parseInt(req.params.id);
            const liquorBottle = await LiquorBottleService.updateLiquorBottle(liquorBottleID, req.body);
            res.status(200).json(liquorBottle);
        } catch (error) {
            next(error);
        }
    },

    async deleteLiquorBottle(req, res, next) {
        try {
            const liquorBottleID = parseInt(req.params.id);
            const result = await LiquorBottleService.deleteLiquorBottle(liquorBottleID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
