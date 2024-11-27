const mongoose = require("mongoose");

async function AddActiveStoreToRequest(req, res, next) {
  try {
    const { storeId } = req.params ?? {};

    if (mongoose.isValidObjectId(storeId)) {
      const activeStoreUser = req.user.stores.find(
        (o) => o.storeId._id == storeId
      );
      req.user.activeStoreUser = activeStoreUser;
    }

    if (!req.user.activeStoreUser) {
      throw new Error("Invalid store");
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { AddActiveStoreToRequest };
