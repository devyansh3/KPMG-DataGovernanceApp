const storeUserDao = require("../dao/storeUserDao");
const { ROLES } = require("../utils/constants");

class StoreUserService {
  async createStoreUser(storeUser) {
    return await storeUserDao.create(storeUser);
  }

  async addStoreUser({ userId, storeId, roles }, session = null) {
    let storeUser = await storeUserDao.create(
      {
        userId,
        storeId,
        roles,
      },
      session
    );
    console.log("SAVED STOREUSER ", storeUser);
    return storeUser;
  }

  async getStoreUsers(filter, session = null) {
    const storeUsers = await storeUserDao.getStoreUsersByFilter(
      filter,
      false,
      true,
      session
    );
    return storeUsers.map((storeUser) => {
      return {
        _id: storeUser.userId?._id,
        username: storeUser.userId?.username,
        roles: storeUser.roles,
      };
    });
  }

  async updateStoreUser(storeUserId, data, session = null) {
    try {
      const res = await storeUserDao.updateOne(storeUserId, data, {}, session);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async getStoreUsersWithAdminRole() {
    try {
      const storeUsersWithAdminRole = await storeUserDao.getStoreUsersByFilter(
        { roles: { $in: [ROLES.ADMIN] } },
        true,
        true
      );
      return storeUsersWithAdminRole;
    } catch (error) {
      console.error("Error fetching store users with ADMIN role:", error);
      throw error;
    }
  }
}

module.exports = new StoreUserService();
