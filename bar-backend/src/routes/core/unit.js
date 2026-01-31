import { Router } from 'express';
import { UnitController } from "../../controllers/core/unitController.js";

const router = Router();

router.get('/', UnitController.getAllUnits);
router.get('/:name', UnitController.getUnitById);
router.post('/', UnitController.createUnit);
router.patch('/:name', UnitController.updateUnit);
router.delete('/:name', UnitController.deleteUnit);

export default router;
