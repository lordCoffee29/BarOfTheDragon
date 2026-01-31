import { Router } from 'express';
import { DrinkController } from "../../controllers/drinks/drinkController.js";

const router = Router();

router.get('/', DrinkController.getAllDrinks);
router.get('/:name', DrinkController.getDrinkById);
router.post('/', DrinkController.createDrink);
router.patch('/:name', DrinkController.updateDrink);
router.delete('/:name', DrinkController.deleteDrink);

export default router;
