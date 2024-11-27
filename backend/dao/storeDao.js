const Store = require('../models/Store');

class StoreDao {
    async createStore(storeData) {
        const newStore = new Store(storeData);
        return await newStore.save();
    }

    async updateStore(id, updateData) {
        return await Store.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteStore(id) {
        return await Store.findByIdAndDelete(id);
    }

    async getStoreById(id) {
        return await Store.findById(id);
    }

    async getAllStores() {
        return await Store.find();
    }

    async findOrCreate(storeData, options) {
        let store = await Store.findOne({ name: storeData.name, pincode: storeData.pincode });
        if (!store) {
            console.timeLog("no store found, creating new")
            store = new Store(storeData);
            await store.save(options);
        }
        return store;
    }
}

module.exports = new StoreDao();
