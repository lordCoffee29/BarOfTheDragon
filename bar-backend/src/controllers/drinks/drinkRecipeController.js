import { DrinkRecipeService } from "../../services/drinks/drinkRecipeService.js";

export const DrinkRecipeController = {
    async getAllDrinkRecipes(req, res, next) {
        try {
            const drinkRecipes = await DrinkRecipeService.getAllDrinkRecipes();
            res.status(200).json(drinkRecipes);
        } catch (error) {
            next(error);
        }
    },

    async getDrinkRecipeById(req, res, next) {
        try {
            const drinkRecipeID = parseInt(req.params.id);
            if (isNaN(drinkRecipeID)) {
                return res.status(400).send({ message: 'Invalid drink recipe ID' });
            }
            const drinkRecipe = await DrinkRecipeService.getDrinkRecipeByID(drinkRecipeID);
            res.status(200).json(drinkRecipe);
        } catch (error) {
            next(error);
        }
    },

    async createDrinkRecipe(req, res, next) {
        try {
            const drinkRecipe = await DrinkRecipeService.createDrinkRecipe(req.body);
            res.status(201).json(drinkRecipe);
        } catch (error) {
            next(error);
        }
    },

    async updateDrinkRecipe(req, res, next) {
        try {
            const drinkRecipeID = parseInt(req.params.id);
            const drinkRecipe = await DrinkRecipeService.updateDrinkRecipe(drinkRecipeID, req.body);
            res.status(200).json(drinkRecipe);
        } catch (error) {
            next(error);
        }
    },

    async deleteDrinkRecipe(req, res, next) {
        try {
            const drinkRecipeID = parseInt(req.params.id);
            const result = await DrinkRecipeService.deleteDrinkRecipe(drinkRecipeID);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
