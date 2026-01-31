import { Router } from 'express';
import { BaseBottleController } from "../../controllers/bases/baseBottleController.js";

const router = Router();

router.get('/', BaseBottleController.getAllBaseBottles);
router.get('/:id', BaseBottleController.getBaseBottleById);
router.post('/', BaseBottleController.createBaseBottle);
router.patch('/:id', BaseBottleController.updateBaseBottle);
router.delete('/:id', BaseBottleController.deleteBaseBottle);

export default router;
