import { LiquorService } from "../../services/liquors/liquorService.js";

export const LiquorController = {
    async getAllLiquors(req, res, next) {
        try {
            const liquors = await LiquorService.getAllLiquors();
            res.status(200).json(liquors);
        } catch (error) {
            next(error);
        }
    },

    async getLiquorById(req, res, next) {
        try {
            const liquorID = parseInt(req.params.id);
            if (isNaN(liquorID)) {
                return res.status(400).send({ message: 'Invalid liquor ID' });
            }
            const liquor = await LiquorService.getLiquorByID(liquorID);
            res.status(200).json(liquor);
        } catch (error) {
            next(error);
        }
    },

    async createLiquor(req, res, next) {
        try {
            const liquor = await LiquorService.createLiquor(req.body);
            res.status(201).json(liquor);
        } catch (error) {
            next(error);
        }
    },

    async updateLiquor(req, res, next) {
        try {
            const liquorID = parseInt(req.params.id);
            const liquor = await LiquorService.updateLiquor(liquorID, req.body);
            res.status(200).json(liquor);
        } catch (error) {
            next(error);
        }
    },

    async deleteLiquor(req, res, next) {
        try {
            const liquorID = parseInt(req.params.id);
            const result = await LiquorService.deleteLiquor(liquorID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
