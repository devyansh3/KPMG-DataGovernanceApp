const UserService = require("../services/userService");
const { formatResponse } = require("../utils/helper");
const { STATUS_CODES } = require("../utils/constants");
const {
  addUserValidation,
  updateUserValidation,
} = require("../validations/userValidation");
const { validate } = require("express-validation");

const addUser = async (req, res, next) => {
  const { userData, storeData } = req.body;
  // Debugging: Log the payload received
  console.log("Received userData:", req.body);
  console.log("Received storeData:", storeData);
  try {
    const newUser = await UserService.addUser(userData, storeData);
    res
      .status(STATUS_CODES.CREATED)
      .json(formatResponse(STATUS_CODES.CREATED, newUser));
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getUsers();
    res.status(STATUS_CODES.OK).json(formatResponse(STATUS_CODES.OK, users));
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUser(id);
    res.status(STATUS_CODES.OK).json(formatResponse(STATUS_CODES.OK, user));
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await UserService.updateUser(id, updateData);
    res
      .status(STATUS_CODES.OK)
      .json(formatResponse(STATUS_CODES.OK, updatedUser));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await UserService.deleteUser(id);
    res.status(STATUS_CODES.OK).json(formatResponse(STATUS_CODES.OK, true));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
