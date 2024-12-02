const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./userRoutes");

const questionRoutes = require("./questionRoutes");
const responseRoutes = require("./responseRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/questions", questionRoutes);
router.use("/responses", responseRoutes);

module.exports = router;
