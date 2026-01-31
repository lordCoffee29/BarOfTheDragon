import { IngredientTypeService } from "../../services/ingredients/ingredientTypeService.js";

export const IngredientTypeController = {
    async getAllIngredientTypes(req, res, next) {
        try {
            const ingredientTypes = await IngredientTypeService.getAllIngredientTypes();
            res.status(200).json(ingredientTypes);
        } catch (error) {
            next(error);
        }
    },

    async getIngredientTypeById(req, res, next) {
        try {
            const name = req.params.name;
            const ingredientType = await IngredientTypeService.getIngredientTypeByID(name);
            res.status(200).json(ingredientType);
        } catch (error) {
            next(error);
        }
    },

    async createIngredientType(req, res, next) {
        try {
            const ingredientType = await IngredientTypeService.createIngredientType(req.body);
            res.status(201).json(ingredientType);
        } catch (error) {
            next(error);
        }
    },

    async deleteIngredientType(req, res, next) {
        try {
            const name = req.params.name;
            const result = await IngredientTypeService.deleteIngredientType(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
