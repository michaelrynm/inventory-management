const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const authRoutes = require("./authRoutes.js");
const productRoutes = require("./productRoutes.js");
const customerRoutes = require("./customerRoutes.js");
const saleRoutes = require("./saleRoutes.js");
const saleDetailRoutes = require("./saleDetailRoutes.js");
const dashboardRoutes = require("./dashboardRoutes.js");
const laporanRoutes = require("./laporanRoutes.js");
const expensesRoute = require("./expensesRoute.js");

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/customers", customerRoutes);
router.use("/sales", saleRoutes);
router.use("/sale-details", saleDetailRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/laporan", laporanRoutes);
router.use("/expenses", expensesRoute);

module.exports = router;
