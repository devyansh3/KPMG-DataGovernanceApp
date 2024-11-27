const UserDao = require("../dao/userDao");
const StoreUserDao = require("../dao/storeUserDao");
const storeDAO = require("../dao/storeDao");
const { ALLOWED_SUB_ROLES, STATUS_CODES } = require("../utils/constants");
const storeUserService = require("./storeUserService");
const { ObjectId, encryptPassword } = require("../utils/helper");
const userDao = require("../dao/userDao");

class UserService {
  async addUser(userData, storeData) {
    try {
      const store = await storeDAO.findOrCreate(storeData);
      const user = await UserDao.create({ ...userData, store: store._id });
      const storeUser = await StoreUserDao.create({
        userId: user._id,
        storeId: store._id,
        roles: [user.role],
      });
      return { user, storeUser };
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    return await UserDao.find();
  }

  async getUser(id) {
    return await UserDao.findById(id);
  }

  async updateUser(id, data) {
    return await UserDao.updateOne(id, data);
  }

  async deleteUser(id) {
    return await UserDao.deleteOne(id);
  }

  async getUserWithFilter(filter, session = null) {
    const user = await UserDao.getUserByFilter(filter, session);
    return user;
  }

  async addUserToStore({ username, password, role, storeId }) {
    const roles = [role].filter((role) => ALLOWED_SUB_ROLES.includes(role));
    if (!roles.length) {
      return { message: "Invalid Role", status: STATUS_CODES.BAD_REQUEST };
    }
    try {
      const existingUser = await this.getUserWithFilter({ username });
      let storeUsers = null;
      if (existingUser) {
        storeUsers = await storeUserService.getStoreUsers({
          userId: ObjectId(existingUser._id),
          storeId: ObjectId(storeId),
        });
        if (storeUsers.length) {
          return {
            message: "User already exists for this store",
            status: STATUS_CODES.NOT_MODIFIED,
          };
        } else {
          await storeUserService.addStoreUser({
            userId: existingUser._id,
            storeId,
            roles,
          });
        }
      } else {
        let newUser = await userDao.create({
          username,
          password,
        });
        await storeUserService.addStoreUser({
          userId: newUser._id,
          storeId,
          roles,
        });
      }
      return {
        message: "User added Successfully",
        status: STATUS_CODES.OK,
      };
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  }

  async updateUserToStore({ username, password, storeId, userId }) {
    try {
      let storeUsers = await storeUserService.getStoreUsers({
        userId: ObjectId(userId),
        storeId: ObjectId(storeId),
      });
      if (!storeUsers) {
        return {
          message: "User not found",
          status: STATUS_CODES.NOT_FOUND,
        };
      }
      let modifiedData = {
        ...(username?.trim() && { username: username.trim() }),
      };
      if (password?.trim()) {
        const encryptedPassword = await encryptPassword(password.trim());
        modifiedData.password = encryptedPassword;
      }
      console.log("MODIFIED", modifiedData);
      await userDao.update(ObjectId(userId), modifiedData, {});
      return {
        message: "User updated Successfully",
        status: STATUS_CODES.OK,
      };
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  }
}

module.exports = new UserService();
