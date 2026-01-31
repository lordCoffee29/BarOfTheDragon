import { IngredientService } from "../../services/ingredients/ingredientService.js";

export const IngredientController = {
    async getAllIngredients(req, res, next) {
        try {
            const ingredients = await IngredientService.getAllIngredients();
            res.status(200).json(ingredients);
        } catch (error) {
            next(error);
        }
    },

    async getIngredientById(req, res, next) {
        try {
            const ingredientID = parseInt(req.params.id);
            if (isNaN(ingredientID)) {
                return res.status(400).send({ message: 'Invalid ingredient ID' });
            }
            const ingredient = await IngredientService.getIngredientByID(ingredientID);
            res.status(200).json(ingredient);
        } catch (error) {
            next(error);
        }
    },

    async createIngredient(req, res, next) {
        try {
            const ingredient = await IngredientService.createIngredient(req.body);
            res.status(201).json(ingredient);
        } catch (error) {
            next(error);
        }
    },

    async updateIngredient(req, res, next) {
        try {
            const ingredientID = parseInt(req.params.id);
            const ingredient = await IngredientService.updateIngredient(ingredientID, req.body);
            res.status(200).json(ingredient);
        } catch (error) {
            next(error);
        }
    },

    async deleteIngredient(req, res, next) {
        try {
            const ingredientID = parseInt(req.params.id);
            const result = await IngredientService.deleteIngredient(ingredientID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
