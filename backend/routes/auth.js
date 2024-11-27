const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const StoreUser = require("../models/StoreUser");
const Store = require("../models/Store");
const {
  ERROR_MESSAGES,
  STATUS_CODES,
  SECRET_KEY,
} = require("../utils/constants");
const StoreUserDao = require("../dao/storeUserDao");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password, role, location } = req.body;
  try {
    const newUser = new User({ username, password, role, location });
    await newUser.save();
    res.status(STATUS_CODES.CREATED).json(newUser);
  } catch (err) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: err.message || ERROR_MESSAGES.COMMON_ERROR_MESSAGE });
  }
});

// Login Route (Modified)
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err || !user) {
      // Check if the error is due to incorrect password
      if (info && info.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      }
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({
          message: info ? info.message : ERROR_MESSAGES.COMMON_ERROR_MESSAGE,
        });
    }
    try {
      // If authentication succeeds, generate JWT token
      const tokenPayload = {
        username: user.username,
      };
      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "2200h" });
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        path: "/",
      };
      return res
        .status(STATUS_CODES.OK)
        .cookie("token", token, cookieOptions)
        .json({ message: "Logged in successfully", user });
    } catch (err) {
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.COMMON_ERROR_MESSAGE });
    }
  })(req, res, next);
});

router.post("/me", async (req, res, next) => {
  passport.authenticate("jwt", async (err, user, info) => {
    try {
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Logged in successfully", user });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  res.status(STATUS_CODES.OK).json({ message: "Logged out successfully" });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_ACCESS });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
    }
    req.user = decoded; // Store decoded user details in request object
    next();
  });
};

router.get("/userdetails", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.INVALID_REQUEST });
    }

    // Fetch store details
    const storeUser = await StoreUser.findOne({ userId: _id }).populate(
      "storeId"
    );
    if (!storeUser) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.INVALID_REQUEST });
    }

    const store = await Store.findById(storeUser.storeId._id);
    if (!store) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.INVALID_REQUEST });
    }

    res.status(STATUS_CODES.OK).json({
      username: user.username,
      role: user.role,
      store: {
        _id: store._id,
        name: store.name,
        pincode: store.pincode,
        address: store.address,
        area: store.area,
        city: store.city,
        state: store.state,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.COMMON_ERROR_MESSAGE });
  }
});

module.exports = router;
