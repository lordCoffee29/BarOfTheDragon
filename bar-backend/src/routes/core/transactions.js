import { Router } from 'express';
import { TransactionController } from "../../controllers/core/transactionsController.js";
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createTransactionSchema, updateTransactionSchema } from '../../schemas/core/transactionsSchema.js';

const router = Router();

router.get('/', TransactionController.getAllTransactions);

router.get('/:id', TransactionController.getTransactionById);

router.get('/filter/:filter', TransactionController.getTransactionsByFilter);

router.post('/', validateData(createTransactionSchema), TransactionController.createTransaction);

router.patch('/:id', validateData(updateTransactionSchema), TransactionController.updateTransaction);

router.delete('/:id', TransactionController.deleteTransaction);

export default router;