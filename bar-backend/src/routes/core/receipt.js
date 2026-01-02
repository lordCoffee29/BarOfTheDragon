import { Router } from 'express';
import { ReceiptController } from "../../controllers/core/receiptController.js";
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createReceiptSchema } from '../../schemas/core/receiptSchema.js';

const router = Router();

router.get('/', ReceiptController.getAllReceipts);

router.get('/:id', ReceiptController.getReceiptById);

router.get('/date/:date', ReceiptController.getTransactionsByReceiptDate);

router.post('/', validateData(createReceiptSchema), ReceiptController.createReceipt);

router.delete('/:id', ReceiptController.deleteReceipt);

export default router;