import { Router } from 'express';
import { DrinkRecipeController } from "../../controllers/drinks/drinkRecipeController.js";

const router = Router();

router.get('/', DrinkRecipeController.getAllDrinkRecipes);
router.get('/:id', DrinkRecipeController.getDrinkRecipeById);
router.post('/', DrinkRecipeController.createDrinkRecipe);
router.patch('/:id', DrinkRecipeController.updateDrinkRecipe);
router.delete('/:id', DrinkRecipeController.deleteDrinkRecipe);

export default router;
