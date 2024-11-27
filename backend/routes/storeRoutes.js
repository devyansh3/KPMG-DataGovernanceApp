const express = require("express");
const passport = require("passport");
const {
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
  getAllStores,
  addUser,
  updateUser,
  getUsers,
} = require("../controllers/storeController");
const { ownerPermission } = require("../middleware/ownerPermission");
const {
  AddActiveStoreToRequest,
} = require("../middleware/addActiveFactoryToRequest");

const router = express.Router();

// Create a new store
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  createStore
);

// Update a store by ID
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  updateStore
);

// Delete a store by ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  deleteStore
);

// Get a store by ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getStoreById
);

// Get all stores
router.get("/", passport.authenticate("jwt", { session: false }), getAllStores);

router.post(
  "/:storeId/user",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  addUser
);

router.put(
  "/:storeId/user/:userId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  updateUser
);

router.get(
  "/:storeId/users",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  getUsers
);

module.exports = router;
