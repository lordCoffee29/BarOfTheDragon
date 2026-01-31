import { Router } from 'express';
import { ToolTypeController } from "../../controllers/tools/toolTypeController.js";

const router = Router();

router.get('/', ToolTypeController.getAllToolTypes);
router.get('/:name', ToolTypeController.getToolTypeById);
router.post('/', ToolTypeController.createToolType);
router.delete('/:name', ToolTypeController.deleteToolType);

export default router;
