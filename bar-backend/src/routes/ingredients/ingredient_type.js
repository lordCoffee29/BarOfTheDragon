import { Router } from 'express';
import { IngredientTypeController } from "../../controllers/ingredients/ingredientTypeController.js";

const router = Router();

router.get('/', IngredientTypeController.getAllIngredientTypes);
router.get('/:name', IngredientTypeController.getIngredientTypeById);
router.post('/', IngredientTypeController.createIngredientType);
router.delete('/:name', IngredientTypeController.deleteIngredientType);

export default router;
