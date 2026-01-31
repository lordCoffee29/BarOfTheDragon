import { Router } from 'express';
import { StoreController } from "../../controllers/core/storeController.js";

const router = Router();

router.get('/', StoreController.getAllStores);
router.get('/:address', StoreController.getStoreById);
router.post('/', StoreController.createStore);
router.patch('/:address', StoreController.updateStore);
router.delete('/:address', StoreController.deleteStore);

export default router;
