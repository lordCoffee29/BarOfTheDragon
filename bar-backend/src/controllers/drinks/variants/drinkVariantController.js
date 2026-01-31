import { DrinkVariantService } from "../../../services/drinks/variants/drinkVariantService.js";

export const DrinkVariantController = {
    async getAllDrinkVariants(req, res, next) {
        try {
            const drinkVariants = await DrinkVariantService.getAllDrinkVariants();
            res.status(200).json(drinkVariants);
        } catch (error) {
            next(error);
        }
    },

    async getDrinkVariantById(req, res, next) {
        try {
            const drinkVariantID = parseInt(req.params.id);
            if (isNaN(drinkVariantID)) {
                return res.status(400).send({ message: 'Invalid drink variant ID' });
            }
            const drinkVariant = await DrinkVariantService.getDrinkVariantByID(drinkVariantID);
            res.status(200).json(drinkVariant);
        } catch (error) {
            next(error);
        }
    },

    async createDrinkVariant(req, res, next) {
        try {
            const drinkVariant = await DrinkVariantService.createDrinkVariant(req.body);
            res.status(201).json(drinkVariant);
        } catch (error) {
            next(error);
        }
    },

    async updateDrinkVariant(req, res, next) {
        try {
            const drinkVariantID = parseInt(req.params.id);
            const drinkVariant = await DrinkVariantService.updateDrinkVariant(drinkVariantID, req.body);
            res.status(200).json(drinkVariant);
        } catch (error) {
            next(error);
        }
    },

    async deleteDrinkVariant(req, res, next) {
        try {
            const drinkVariantID = parseInt(req.params.id);
            const result = await DrinkVariantService.deleteDrinkVariant(drinkVariantID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
