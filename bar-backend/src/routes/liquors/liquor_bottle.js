import { Router } from 'express';
import { LiquorBottleController } from "../../controllers/liquors/liquorBottleController.js";

const router = Router();

router.get('/', LiquorBottleController.getAllLiquorBottles);
router.get('/:id', LiquorBottleController.getLiquorBottleById);
router.post('/', LiquorBottleController.createLiquorBottle);
router.patch('/:id', LiquorBottleController.updateLiquorBottle);
router.delete('/:id', LiquorBottleController.deleteLiquorBottle);

export default router;
