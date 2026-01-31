import { Router } from 'express';
import { DrinkVariantIngredientController } from "../../../controllers/drinks/variants/drinkVariantIngredientController.js";

const router = Router();

router.get('/', DrinkVariantIngredientController.getAllDrinkVariantIngredients);
router.get('/:variantID/:originalIngredient', DrinkVariantIngredientController.getDrinkVariantIngredientById);
router.post('/', DrinkVariantIngredientController.createDrinkVariantIngredient);
router.patch('/:variantID/:originalIngredient', DrinkVariantIngredientController.updateDrinkVariantIngredient);
router.delete('/:variantID/:originalIngredient', DrinkVariantIngredientController.deleteDrinkVariantIngredient);

export default router;
