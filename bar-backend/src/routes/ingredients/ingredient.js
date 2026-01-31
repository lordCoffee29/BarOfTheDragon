import { Router } from 'express';
import { IngredientController } from "../../controllers/ingredients/ingredientController.js";

const router = Router();

router.get('/', IngredientController.getAllIngredients);
router.get('/:id', IngredientController.getIngredientById);
router.post('/', IngredientController.createIngredient);
router.patch('/:id', IngredientController.updateIngredient);
router.delete('/:id', IngredientController.deleteIngredient);

export default router;
