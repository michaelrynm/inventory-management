const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporanController.js");

router.get("/", laporanController.getReportData);
router.get("/weekly-reports", laporanController.getWeeklySalesData);
router.get("/monthly-comparison", laporanController.getMonthlySalesComparison)
module.exports = router;
