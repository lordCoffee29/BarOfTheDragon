import { Router } from 'express';
import { ToolController } from "../../controllers/tools/toolController.js";

const router = Router();

router.get('/', ToolController.getAllTools);
router.get('/:name', ToolController.getToolById);
router.post('/', ToolController.createTool);
router.patch('/:name', ToolController.updateTool);
router.delete('/:name', ToolController.deleteTool);

export default router;
