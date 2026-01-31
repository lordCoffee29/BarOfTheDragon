import { PurchaseCategoryService } from "../../services/core/purchaseCategoryService.js";

export const PurchaseCategoryController = {
    async getAllPurchaseCategories(req, res, next) {
        try {
            const purchaseCategories = await PurchaseCategoryService.getAllPurchaseCategories();
            res.status(200).json(purchaseCategories);
        } catch (error) {
            next(error);
        }
    },

    async getPurchaseCategoryById(req, res, next) {
        try {
            const name = req.params.name;
            const purchaseCategory = await PurchaseCategoryService.getPurchaseCategoryByID(name);
            res.status(200).json(purchaseCategory);
        } catch (error) {
            next(error);
        }
    },

    async createPurchaseCategory(req, res, next) {
        try {
            const purchaseCategory = await PurchaseCategoryService.createPurchaseCategory(req.body);
            res.status(201).json(purchaseCategory);
        } catch (error) {
            next(error);
        }
    },

    async deletePurchaseCategory(req, res, next) {
        try {
            const name = req.params.name;
            const result = await PurchaseCategoryService.deletePurchaseCategory(name);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
