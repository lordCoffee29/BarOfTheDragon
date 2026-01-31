import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { PurchaseCategorytModel } from '../../models/core/purchaseCategoryModel.js';

export const PurchaseCategoryService = {
    async getAllPurchaseCategories() {
        return PurchaseCategorytModel.getAll();
    },

    async getPurchaseCategoryByID(name) {
        const purchaseCategory = await PurchaseCategorytModel.getByID(name);
        if(!purchaseCategory) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return purchaseCategory;
    },

    async createPurchaseCategory(newPurchaseCategory) {
        const { name } = newPurchaseCategory;

        if( !name ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdPurchaseCategory = await PurchaseCategorytModel.create(newPurchaseCategory);

        return createdPurchaseCategory;
    },

    async deletePurchaseCategory(name) {
        const purchaseCategory = await PurchaseCategorytModel.getByID(name);

        if (!purchaseCategory) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const rowCount = await PurchaseCategorytModel.delete(name);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Purchase category deleted successfully' };
    }
};
