const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const authRoutes = require("./authRoutes.js");
const productRoutes = require("./productRoutes.js");
const customerRoutes = require("./customerRoutes.js");

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/customers", customerRoutes);

module.exports = router;
