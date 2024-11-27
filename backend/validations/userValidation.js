const Joi = require("joi");
const { ROLES } = require("../utils/constants");

const addUserValidation = {
  body: Joi.object({
    userData: Joi.object({
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(6).required(),
      role: Joi.string()
        .valid(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.ASSOCIATE)
        .required(),
    }).required(),
    storeData: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      pincode: Joi.string().length(6).required(),
      address: Joi.string().min(5).max(200).required(),
      area: Joi.string().min(2).max(100).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
    }).required(),
  }),
};

const updateUserValidation = {
  body: Joi.object({
    userData: Joi.object({
      username: Joi.string().min(3).max(30),
      password: Joi.string().min(6),
      role: Joi.string().valid(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.ASSOCIATE),
    }),
    storeData: Joi.object({
      name: Joi.string().min(2).max(100),
      pincode: Joi.string().length(6),
      address: Joi.string().min(5).max(200),
      area: Joi.string().min(2).max(100),
      city: Joi.string().min(2).max(100),
      state: Joi.string().min(2).max(100),
    }),
  }),
};

module.exports = {
  addUserValidation,
  updateUserValidation,
};
