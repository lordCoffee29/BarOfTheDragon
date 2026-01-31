import { Router } from 'express';
import { BaseTypeController } from "../../controllers/bases/baseTypeController.js";

const router = Router();

router.get('/', BaseTypeController.getAllBaseTypes);
router.get('/:name', BaseTypeController.getBaseTypeById);
router.post('/', BaseTypeController.createBaseType);
router.delete('/:name', BaseTypeController.deleteBaseType);

export default router;
