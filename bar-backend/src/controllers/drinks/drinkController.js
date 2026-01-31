import { DrinkService } from "../../services/drinks/drinkService.js";

export const DrinkController = {
    async getAllDrinks(req, res, next) {
        try {
            const drinks = await DrinkService.getAllDrinks();
            res.status(200).json(drinks);
        } catch (error) {
            next(error);
        }
    },

    async getDrinkById(req, res, next) {
        try {
            const name = req.params.name;
            const drink = await DrinkService.getDrinkByID(name);
            res.status(200).json(drink);
        } catch (error) {
            next(error);
        }
    },

    async createDrink(req, res, next) {
        try {
            const drink = await DrinkService.createDrink(req.body);
            res.status(201).json(drink);
        } catch (error) {
            next(error);
        }
    },

    async updateDrink(req, res, next) {
        try {
            const name = req.params.name;
            const drink = await DrinkService.updateDrink(name, req.body);
            res.status(200).json(drink);
        } catch (error) {
            next(error);
        }
    },

    async deleteDrink(req, res, next) {
        try {
            const name = req.params.name;
            const result = await DrinkService.deleteDrink(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
