const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./userRoutes");
const bookingRoutes = require("./bookingRoutes");
const storeRoutes = require("./storeRoutes");
const customerRoutes = require("./customerRoutes");
const transactionRoutes = require("./transactionRoutes");
const notificationRoutes = require("./notificationRoutes");
const questionRoutes = require("./questionRoutes");
const responseRoutes = require("./responseRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingRoutes);
router.use("/stores", storeRoutes);
router.use("/customers", customerRoutes);
router.use("/transactions", transactionRoutes);
router.use("/notify", notificationRoutes);
router.use("/questions", questionRoutes);
router.use("/responses", responseRoutes);

module.exports = router;
