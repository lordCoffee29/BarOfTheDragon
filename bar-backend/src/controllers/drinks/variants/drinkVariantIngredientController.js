import { DrinkVariantIngredientService } from "../../../services/drinks/variants/drinkVariantIngredientService.js";

export const DrinkVariantIngredientController = {
    async getAllDrinkVariantIngredients(req, res, next) {
        try {
            const drinkVariantIngredients = await DrinkVariantIngredientService.getAllDrinkVariantIngredients();
            res.status(200).json(drinkVariantIngredients);
        } catch (error) {
            next(error);
        }
    },

    async getDrinkVariantIngredientById(req, res, next) {
        try {
            const variantID = parseInt(req.params.variantID);
            const originalIngredient = req.params.originalIngredient;
            if (isNaN(variantID)) {
                return res.status(400).send({ message: 'Invalid variant ID' });
            }
            const drinkVariantIngredient = await DrinkVariantIngredientService.getDrinkVariantIngredientByID(variantID, originalIngredient);
            res.status(200).json(drinkVariantIngredient);
        } catch (error) {
            next(error);
        }
    },

    async createDrinkVariantIngredient(req, res, next) {
        try {
            const drinkVariantIngredient = await DrinkVariantIngredientService.createDrinkVariantIngredient(req.body);
            res.status(201).json(drinkVariantIngredient);
        } catch (error) {
            next(error);
        }
    },

    async updateDrinkVariantIngredient(req, res, next) {
        try {
            const variantID = parseInt(req.params.variantID);
            const originalIngredient = req.params.originalIngredient;
            const drinkVariantIngredient = await DrinkVariantIngredientService.updateDrinkVariantIngredient(variantID, originalIngredient, req.body);
            res.status(200).json(drinkVariantIngredient);
        } catch (error) {
            next(error);
        }
    },

    async deleteDrinkVariantIngredient(req, res, next) {
        try {
            const variantID = parseInt(req.params.variantID);
            const originalIngredient = req.params.originalIngredient;
            const result = await DrinkVariantIngredientService.deleteDrinkVariantIngredient(variantID, originalIngredient);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
