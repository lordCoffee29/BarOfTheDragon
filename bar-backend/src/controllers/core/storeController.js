import { StoreService } from "../../services/core/storeService.js";

export const StoreController = {
    async getAllStores(req, res, next) {
        try {
            const stores = await StoreService.getAllStores();
            res.status(200).json(stores);
        } catch (error) {
            next(error);
        }
    },

    async getStoreById(req, res, next) {
        try {
            const address = req.params.address;
            const store = await StoreService.getStoreByID(address);
            res.status(200).json(store);
        } catch (error) {
            next(error);
        }
    },

    async createStore(req, res, next) {
        try {
            const store = await StoreService.createStore(req.body);
            res.status(201).json(store);
        } catch (error) {
            next(error);
        }
    },

    async updateStore(req, res, next) {
        try {
            const address = req.params.address;
            const store = await StoreService.updateStore(address, req.body);
            res.status(200).json(store);
        } catch (error) {
            next(error);
        }
    },

    async deleteStore(req, res, next) {
        try {
            const address = req.params.address;
            const result = await StoreService.deleteStore(address);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
