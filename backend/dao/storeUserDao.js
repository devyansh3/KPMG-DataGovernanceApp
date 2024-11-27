const StoreUser = require("../models/StoreUser");

class StoreUserDao {
  async create(data, session = null) {
    const storeUser = new StoreUser(data);
    const savedStoreUser = await storeUser.save();
    return savedStoreUser;
  }

  async getStoreUsersByFilter(
    filter = {},
    populateStore = false,
    populateUser = false,
    session = null
  ) {
    if (filter.storeId && typeof filter.storeId == "string") {
      filter.storeId = ObjectId(filter.storeId);
    }
    if (filter.userId && typeof filter.userId == "string") {
      filter.userId = ObjectId(filter.userId);
    }
    try {
      let storeUserQuery = StoreUser.find(filter, {}, { session });
      if (populateStore) storeUserQuery = storeUserQuery.populate("storeId");
      if (populateUser) storeUserQuery = storeUserQuery.populate("userId");
      const storeUsers = await storeUserQuery;
      return storeUsers;
    } catch (err) {
      throw err;
    }
  }

  async updateOne(id, setData, unsetData, session = null) {
    try {
      const updatedStoreUser = await StoreUser.findOneAndUpdate(
        { _id: id },
        { $set: setData, $unset: unsetData },
        { new: true, session }
      );
      return updatedStoreUser;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new StoreUserDao();
