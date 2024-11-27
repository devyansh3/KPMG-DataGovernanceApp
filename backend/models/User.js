// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { encryptPassword } = require("../utils/helper");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await encryptPassword(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
