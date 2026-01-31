import { Router } from 'express';
import { IngredientItemController } from "../../controllers/ingredients/ingredientItemController.js";

const router = Router();

router.get('/', IngredientItemController.getAllIngredientItems);
router.get('/:id', IngredientItemController.getIngredientItemById);
router.post('/', IngredientItemController.createIngredientItem);
router.patch('/:id', IngredientItemController.updateIngredientItem);
router.delete('/:id', IngredientItemController.deleteIngredientItem);

export default router;
