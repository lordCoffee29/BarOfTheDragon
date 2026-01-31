import ERROR_MESSAGES from "../../constants/errorMessages.js";
import { StoreModel } from '../../models/core/storeModel.js';

export const StoreService = {
    async getAllStores() {
        return StoreModel.getAll();
    },

    async getStoreByID(address) {
        const store = await StoreModel.getByID(address);
        if(!store) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }
        return store;
    },

    async createStore(newStore) {
        const { address, name } = newStore;

        if( !address || !name ) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const createdStore = await StoreModel.create(newStore);

        return createdStore;
    },

    async updateStore(address, newValues) {
        if(Object.keys(newValues).length === 0) {
            throw new Error('Missing required fields');
        }

        const updatedStore = await StoreModel.update(address, newValues);

        if(!updatedStore) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        return updatedStore;
    },

    async deleteStore(address) {
        const store = await StoreModel.getByID(address);

        if (!store) {
            throw new Error(ERROR_MESSAGES.ITEM_NOT_FOUND, 404);
        }

        const rowCount = await StoreModel.delete(address);

        if(rowCount === 0) {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
        }

        return { message: 'Store deleted successfully' };
    }
};
