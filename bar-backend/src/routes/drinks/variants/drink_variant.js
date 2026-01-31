import { Router } from 'express';
import { DrinkVariantController } from "../../../controllers/drinks/variants/drinkVariantController.js";

const router = Router();

router.get('/', DrinkVariantController.getAllDrinkVariants);
router.get('/:id', DrinkVariantController.getDrinkVariantById);
router.post('/', DrinkVariantController.createDrinkVariant);
router.patch('/:id', DrinkVariantController.updateDrinkVariant);
router.delete('/:id', DrinkVariantController.deleteDrinkVariant);

export default router;
