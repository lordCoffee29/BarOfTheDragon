import { IngredientItemService } from "../../services/ingredients/ingredientItemService.js";

export const IngredientItemController = {
    async getAllIngredientItems(req, res, next) {
        try {
            const ingredientItems = await IngredientItemService.getAllIngredientItems();
            res.status(200).json(ingredientItems);
        } catch (error) {
            next(error);
        }
    },

    async getIngredientItemById(req, res, next) {
        try {
            const ingredientItemID = parseInt(req.params.id);
            if (isNaN(ingredientItemID)) {
                return res.status(400).send({ message: 'Invalid ingredient item ID' });
            }
            const ingredientItem = await IngredientItemService.getIngredientItemByID(ingredientItemID);
            res.status(200).json(ingredientItem);
        } catch (error) {
            next(error);
        }
    },

    async createIngredientItem(req, res, next) {
        try {
            const ingredientItem = await IngredientItemService.createIngredientItem(req.body);
            res.status(201).json(ingredientItem);
        } catch (error) {
            next(error);
        }
    },

    async updateIngredientItem(req, res, next) {
        try {
            const ingredientItemID = parseInt(req.params.id);
            const ingredientItem = await IngredientItemService.updateIngredientItem(ingredientItemID, req.body);
            res.status(200).json(ingredientItem);
        } catch (error) {
            next(error);
        }
    },

    async deleteIngredientItem(req, res, next) {
        try {
            const ingredientItemID = parseInt(req.params.id);
            const result = await IngredientItemService.deleteIngredientItem(ingredientItemID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
