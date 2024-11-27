const mongoose = require("mongoose");
const { ROLES } = require("../utils/constants");
const Schema = mongoose.Schema;

const storeUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  roles: [
    {
      type: String,
      enum: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.ASSOCIATE],
      required: true,
    },
  ],
});

module.exports = mongoose.model("StoreUser", storeUserSchema);
