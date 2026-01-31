import { Router } from 'express';
import { PurchaseCategoryController } from "../../controllers/core/purchaseCategoryController.js";

const router = Router();

router.get('/', PurchaseCategoryController.getAllPurchaseCategories);
router.get('/:name', PurchaseCategoryController.getPurchaseCategoryById);
router.post('/', PurchaseCategoryController.createPurchaseCategory);
router.delete('/:name', PurchaseCategoryController.deletePurchaseCategory);

export default router;
