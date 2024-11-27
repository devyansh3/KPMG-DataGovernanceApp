const storeDAO = require("../dao/storeDao");

exports.createStore = async (storeData) => {
    return await storeDAO.createStore(storeData);
};

exports.updateStore = async (id, updateData) => {
    return await storeDAO.updateStore(id, updateData);
};

exports.deleteStore = async (id) => {
    return await storeDAO.deleteStore(id);
};

exports.getStoreById = async (id) => {
    return await storeDAO.getStoreById(id);
};

exports.getAllStores = async () => {
    return await storeDAO.getAllStores();
};
