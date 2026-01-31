import { Router } from 'express';
import { BaseController } from "../../controllers/bases/baseController.js";

const router = Router();

router.get('/', BaseController.getAllBases);
router.get('/:id', BaseController.getBaseById);
router.post('/', BaseController.createBase);
router.patch('/:id', BaseController.updateBase);
router.delete('/:id', BaseController.deleteBase);

export default router;
