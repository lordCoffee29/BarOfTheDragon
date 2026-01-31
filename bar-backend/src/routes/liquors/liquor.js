import { Router } from 'express';
import { LiquorController } from "../../controllers/liquors/liquorController.js";

const router = Router();

router.get('/', LiquorController.getAllLiquors);
router.get('/:id', LiquorController.getLiquorById);
router.post('/', LiquorController.createLiquor);
router.patch('/:id', LiquorController.updateLiquor);
router.delete('/:id', LiquorController.deleteLiquor);

export default router;
