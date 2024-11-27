// routes/userRoutes.js
const express = require("express");
const passport = require("passport");
const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserValidation,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const {
  ownerPermission,
  locationPermission,
} = require("../middleware/ownerPermission");

const router = express.Router();

// Add new user to store
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  addUser
);

// Get all users
router.get(
  "/:storeId/",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  getUsers
);

// Get user by ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  getUser
);

// Update user by ID
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  updateUser
);

// Delete user by ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ownerPermission,
  deleteUser
);

module.exports = router;
