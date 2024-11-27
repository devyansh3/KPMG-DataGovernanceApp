const User = require("../models/User");

class UserDao {
  async create(data) {
    try {
      const user = new User(data);
      const savedUser = await user.save();
      console.log("NEW USER", savedUser);
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async find() {
    return await User.find().select("-password");
  }

  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async updateOne(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteOne(id) {
    return await User.findByIdAndDelete(id);
  }

  async getUserByFilter(filter = {}, session = null) {
    try {
      let user = await User.findOne(filter, {}, { session });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async update(id, setData, unsetData, session = null) {
    try {
      const savedUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: setData, $unset: unsetData },
        { new: true, session }
      );
      console.log("UPDATES USER", savedUser);
      return savedUser;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserDao();
