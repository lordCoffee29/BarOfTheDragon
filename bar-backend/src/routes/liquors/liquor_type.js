import { Router } from 'express';
import { LiquorTypeController } from "../../controllers/liquors/liquorTypeController.js";

const router = Router();

router.get('/', LiquorTypeController.getAllLiquorTypes);
router.get('/:name', LiquorTypeController.getLiquorTypeById);
router.post('/', LiquorTypeController.createLiquorType);
router.delete('/:name', LiquorTypeController.deleteLiquorType);

export default router;
