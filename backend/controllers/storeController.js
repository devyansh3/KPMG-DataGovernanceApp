const storeService = require("../services/storeService");
const storeUserService = require("../services/storeUserService");
const userService = require("../services/userService");
const { STATUS_CODES, ROLES } = require("../utils/constants");
const { ObjectId } = require("../utils/helper");

exports.createStore = async (req, res) => {
  try {
    const storeData = req.body;
    storeData.createdBy = req.user._id; // Assuming the user ID is available in req.user
    const newStore = await storeService.createStore(storeData);
    if (!newStore) {
      res.status(400).json({ message: "Could not add new store" });
    }
    if (newStore) {
      const storeUser = {
        storeId: newStore._id,
        userId: req.user._id,
        roles: [ROLES.ADMIN],
      };
      await storeUserService.createStoreUser(storeUser);
      res
        .status(201)
        .json({ status: 201, message: "New Store added successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStore = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedStore = await storeService.updateStore(id, updateData);
    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(updatedStore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStore = await storeService.deleteStore(id);
    if (!deletedStore) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await storeService.getStoreById(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeService.getAllStores();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addUser = async (req, res, next) => {
  const { username, password, role } = req.body;
  const storeId = req.user.activeStoreUser.storeId._id;
  try {
    const { status, message } = await userService.addUserToStore({
      username,
      password,
      role,
      storeId,
    });
    return res.status(STATUS_CODES.OK).json({ message, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const { username, password } = req.body;
  const storeId = req.user.activeStoreUser.storeId._id;
  const userId = req.params.userId;
  try {
    const { status, message } = await userService.updateUserToStore({
      username,
      password,
      storeId,
      userId,
    });
    return res.status(STATUS_CODES.OK).json({ message, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res, next) => {
  const storeId = req.user.activeStoreUser.storeId._id;
  try {
    const users = await storeUserService.getStoreUsers({
      storeId: ObjectId(storeId),
    });
    return res.status(STATUS_CODES.OK).json(users);
  } catch (error) {
    next(error);
  }
};
