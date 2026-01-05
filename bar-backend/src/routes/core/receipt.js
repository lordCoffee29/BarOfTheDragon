import { Router } from 'express';
import { ReceiptController } from "../../controllers/core/receiptController.js";
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createReceiptSchema, updateReceiptSchema } from '../../schemas/core/receiptSchema.js';

const router = Router();

router.get('/', ReceiptController.getAllReceipts);

router.get('/list-view/:params', ReceiptController.getListView);

router.get('/:id', ReceiptController.getReceiptById);

router.get('/date/:date', ReceiptController.getTransactionsByReceiptDate);

router.post('/', validateData(createReceiptSchema), ReceiptController.createReceipt);

router.patch('/:id', validateData(updateReceiptSchema), ReceiptController.updateReceipt);

router.delete('/:id', ReceiptController.deleteReceipt);

export default router;