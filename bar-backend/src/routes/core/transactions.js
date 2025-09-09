import { Router } from "express";
import { TransactionController } from "../../controllers/core/transactionController.js";

const router = Router ();

router.get('/', TransactionController.getAllTransactions);

router.get('/:id', TransactionController.getTransactionById);

router.post('/', TransactionController.createTransaction);

router.patch('/:id', TransactionController.updateTransaction);

router.delete('/:id', TransactionController.deleteTransaction);

export default router;